import React, { useRef, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import {initialConfig}  from "../../config"
import { DT } from "../../redux/dispatchTypes";
import {
  AddressSuggestions,
  DaDataAddress,
  DaDataSuggestion,
} from "react-dadata";
import "react-dadata/dist/react-dadata.css";
import {
  FullscreenControl,
  Map,
  Placemark,
  Polygon,
  YMaps,
  ZoomControl,
} from "react-yandex-maps";
import {
  Dialog,
  DialogActions,
  Button,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@material-ui/core";
import { addressAPI } from "../API";

/**
 *  Ввод и редактирование адреса, проверка на вхождение в полигон доставки
 *  polygonId на сервере не связываем, необходимо проверять при каждом обращении к адресу, т.к. полигоны могут меняться
 *  изменения адреса и смена адреса сохраняются атомарно
 *  в случае если нет координат адресса, можно указать его на карте для получения координат и вхождения полигон доставки (НЕУДОБНО!! возможно более опытным админам разрешить выбирать районы доставки руками из списка)
 *
 * */
interface IEditAddress extends PropsFromRedux {}

const EditAddress = (props: IEditAddress) => {
  const pointLat = 44.9798045; // стартовые позиции точки прожаж, на несколько точек брать с базы
  const pointLon = 38.9417658;
  const edit = props.navigation.addressMode === "edit";

  const initAddressEdit = (el: string) => {
    if (props.order.addresses.some(({ addressId }) => addressId)) {
      return props.order.addresses.filter(
        ({ addressId }) => addressId === props.order.addressId
      )[0][el];
    }
    return null;
  };

  const [city, setCity] = useState(() => (edit ? initAddressEdit("city") : ""));
  const [street, setStreet] = useState<string | null>(() =>
    edit ? initAddressEdit("street") : null
  );
  const [house, setHouse] = useState<string | null>(() =>
    edit ? initAddressEdit("house") : null
  );
  const [geoLat, setGeoLat] = useState<number | null>(() =>
    edit ? initAddressEdit("geoLat") : null
  );
  const [geoLon, setGeoLon] = useState<number | null>(() =>
    edit ? initAddressEdit("geoLon") : null
  );
  const [polygonId, setPolygonId] = useState(() =>
    edit ? initAddressEdit("polygonId") : 0
  );
  const [qcGeo, setQcGeo] = useState<number | null>(() =>
    edit ? initAddressEdit("qcGeo") : null
  ); //точность координат 0- точные  1 - Ближайший дом 2 - Улица 3 - Населенный пункт 4 - Город 5 - Координаты не определены
  const [fiasLevel, setFiasLevel] = useState<number | null>(() =>
    edit ? initAddressEdit("fiasLevel") : null
  ); //точность адреса 0 — страна 1 — регион 3 — район  4 — город  5 — район города   6 — населенный пункт   7 — улица   8 — дом   65 — планировочная структура   90 — доп. территория   91 — улица в доп. территории  -1 — иностранный или пустой
  const [address, setAddress] = useState<string | null>(() =>
    edit ? initAddressEdit("addressRepresent") : null
  );
  const [polygonDescription, setPolygonDescription] = useState<string | null>(
    () => (edit ? initAddressEdit("polygonDescription") : null)
  );
  const [addressChecked, setAddressChecked] = useState<boolean>(false);
  const [room, setRoom] = useState<string | null>(() =>
    edit ? initAddressEdit("room") : null
  );
  const [porch, setPorch] = useState<string | null>(() =>
    edit ? initAddressEdit("porch") : null
  );
  const [floor, setFloor] = useState<string | null>(() =>
    edit ? initAddressEdit("floor") : null
  );
  const [comment, setComment] = useState<string | null>(() =>
    edit ? initAddressEdit("comment") : null
  );
  const [error, setError] = useState<string | null>("");

  const YM = useRef({});
  //const [cord, setCords ] =useState([45.002434, 38.94184]);

  const selectSuggestion = (
    suggestion: DaDataSuggestion<DaDataAddress> | undefined
  ) => {
    if (suggestion === undefined) {
      return;
    }
    setCity([suggestion.data.city, suggestion.data.settlement].join(""));
    setStreet(suggestion.data.street);
    setHouse(suggestion.data.house);
    setGeoLat(
      suggestion.data.geo_lat ? parseFloat(suggestion.data.geo_lat) : null
    );
    setGeoLon(
      suggestion.data.geo_lon ? parseFloat(suggestion.data.geo_lon) : null
    );
    if (suggestion.data.qc_geo != null) {
      setQcGeo(Number.parseInt(suggestion.data.qc_geo, 10));
    }
    setFiasLevel(parseInt(suggestion.data.fias_level, 10));
    setAddress(makeAddressString(suggestion));
    setError("");
    setAddressChecked(false);
    setPolygonId(0);
  };

  const makeAddressString = (suggestion: DaDataSuggestion<DaDataAddress>) => {
    const joinCustom = (arr: any, separator: string) => {
      return arr.filter((n: string) => n).join(separator);
    };
    if (
      (suggestion.data.region || suggestion.data.area) &&
      !suggestion.data.city &&
      !suggestion.data.settlement
    ) {
      return "";
    }
    return joinCustom(
      [
        suggestion.data.city_with_type,
        suggestion.data.settlement_with_type,
        suggestion.data.street_with_type,
        joinCustom(
          [
            suggestion.data.house_type,
            suggestion.data.house,
            suggestion.data.block_type,
            suggestion.data.block,
          ],
          " "
        ),
      ],
      ", "
    );
  };

  const formatResult = (suggestion: DaDataSuggestion<DaDataAddress>) => {
    let newValue = makeAddressString(suggestion);
    suggestion.value = newValue;
    return newValue;
  };

  const clickButtonOK = () => {
    if (!house) {
      setError("Необходимо указать дом!");
      return;
    }

    if (qcGeo === null || qcGeo > 2) {
      setError("Невозможно расчитать доставку, укажите адрес на карте!");
      return;
    }
    if (!addressChecked) {
      getPolygon();
      return;
    }

    let data = {
      terminalId: props.appState.terminalId,
      customerId: props.order.customer.customerId,
      orderId: props.order.orderId,
      addressRepresent: address,
      city: city,
      street: street,
      house: house,
      room: room,
      porch: porch,
      floor: floor,
      geoLat: geoLat,
      geoLon: geoLon,
      qcGeo: qcGeo,
      fiasLevel: fiasLevel,
      comment: comment,
    };
    if (props.navigation.addressMode === "new") {
      postNew(data);
    } else {
      postUpdate({ ...data, addressId: props.order.addressId });
    }
  };

  const postNew = (data: object) => {
    props.setPreloader(true);
    addressAPI
      .postNew(data)
      .then((response) => {
        props.setPreloader(false);
        let newAddresses = response.data.address.addresses;
        let newAddressId = response.data.address.addressId;
        if (newAddresses) {
          props.orderSetContent({
            addresses: newAddresses,
            addressId: newAddressId,
            shippingMethod: "delivery",
          });
          props.setAddressMode("none");
        }
      })
      .catch((error) => {
        console.error(error);
        props.setPreloader(false);
        props.setNetworkError(true);
      });
  };
  const postUpdate = (data: object) => {
    props.setPreloader(true);
    addressAPI
      .postUpdate(data)
      .then((response) => {
        props.setPreloader(false);
        let newAddresses = response.data.address.addresses;
        if (newAddresses) {
          props.orderSetContent({
            addresses: newAddresses,
            shippingMethod: "delivery",
          });
          props.setAddressMode("none");
        }
      })
      .catch((error) => {
        console.error(error);
        props.setPreloader(false);
        props.setNetworkError(true);
      });
  };

  const getPolygon = () => {
    props.setPreloader(true);
    addressAPI
      .getPolygon({
        terminalId: props.appState.terminalId,
        geoLat: geoLat,
        geoLon: geoLon,
      })
      .then((response) => {
        props.setPreloader(false);
        let polygon = response.data.address.polygon;
        if (polygon) {
          setAddressChecked(true);
          setPolygonId(parseInt(polygon.polygonId, 10));
          setPolygonDescription(polygon.polygonDescription);
        } else {
          setPolygonId(-1);
          setPolygonDescription("Доставка не осуществляется!");
        }
      })
      .catch((error) => {
        console.error(error);
        props.setPreloader(false);
        props.setNetworkError(true);
      });
  };

  const onDragEnd = (getCoordinates: number[]) => {
    console.log(getCoordinates);
    setQcGeo(2); // ставим что определили с точностью до улицы
    setGeoLat(getCoordinates[0]);
    setGeoLon(getCoordinates[1]);
    setError("");
  };

  const yMap = (
    <YMaps query={{ apikey: initialConfig.YMapsApikey }}>
      <Map
        modules={["geolocation", "geocode"]}
        state={{
          center: [geoLat ? geoLat : pointLat, geoLon ? geoLon : pointLon],
          zoom: geoLat && geoLon ? 13 : 12,
        }}
        onLoad={(inst) => (YM.current = inst)}
        width={"100%"}
      >
        <Placemark
          geometry={[geoLat ? geoLat : pointLat, geoLon ? geoLon : pointLon]}
          options={{
            draggable: "true",
          }}
          properties={{
            iconContent: "&#128522;",
          }}
          // modules = {["geoObject.addon.balloon"]}
          // instanceRef = {ref => {
          //        ref &&
          //        ref.balloon.open ();
          // }}
          onDragEnd={(e: any) =>
            onDragEnd(e.get("target").geometry.getCoordinates())
          }
        />
        <ZoomControl /> <Polygon />
        <FullscreenControl />
      </Map>
    </YMaps>
  );

  const addressRepresent = [
    address,
    address && room ? ", кв " + room : "",
    address && porch ? ", п " + porch : "",
    address && floor ? ", э " + floor : "",
  ].join("");

  const message = (polygonId === 0 && <></>) ||
    (polygonId === -1 && (
      <div style={{ color: "red" }}>{polygonDescription}</div>
    )) || <div style={{ color: "green" }}>{polygonDescription}</div>;
  const errorMessage = error && <div style={{ color: "red" }}>{error}</div>;

  return (
    <Dialog open={true} maxWidth={"lg"}>
      <DialogTitle>
        {" "}
        {props.navigation.addressMode === "new"
          ? "Добавление адреса"
          : "Редактирование адреса"}
      </DialogTitle>
      <DialogContent>
        <b style={{ padding: "10px" }}>{addressRepresent}</b>

        <Grid item xs={12} style={{ padding: "10px" }}>
          <AddressSuggestions
            token={initialConfig.tokenDaData}
            count={6}
            customInput={TextField}
            onChange={selectSuggestion}
            renderOption={formatResult}
            defaultQuery={address ? address : ""}
            filterLocations={[
              { area_fias_id: "34a0d847-a43b-421f-86c3-8eaf84c1ce28" },
            ]}
          />
        </Grid>

        <Grid container>
          <Grid item xs={4} style={{ padding: "10px" }}>
            <TextField
              fullWidth
              label="Квартира"
              onChange={(e) => setRoom(e.target.value)}
              value={room ? room : ""}
            />
          </Grid>
          <Grid item xs={4} style={{ padding: "10px" }}>
            <TextField
              fullWidth
              label="Подъезд"
              onChange={(e) => setPorch(e.target.value)}
              value={porch ? porch : ""}
            />
          </Grid>
          <Grid item xs={4} style={{ padding: "10px" }}>
            <TextField
              fullWidth
              label="Этаж"
              onChange={(e) => setFloor(e.target.value)}
              value={floor ? floor : ""}
            />
          </Grid>

          <Grid item xs={12} style={{ padding: "10px" }}>
            <TextField
              fullWidth
              label="Комментарий"
              onChange={(e) => setComment(e.target.value)}
              value={comment ? comment : ""}
            />
          </Grid>
        </Grid>
        {errorMessage}
        {message}

        {yMap}
      </DialogContent>
      <DialogActions>
        <Button
          color="secondary"
          variant="outlined"
          style={{ marginRight: "20px" }}
          onClick={() => {
            props.setAddressMode("none");
          }}
        >
          Закрыть
        </Button>
        <Button color="primary" variant="outlined" onClick={clickButtonOK}>
          {addressChecked ? "Сохранить" : "Проверить"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

interface ImapState {
  config: {
    tokenDaData: string;
    YMapsApikey: string;
  };
  appState: {
    terminalId: number;
  };
  order: {
    orderData: {
      orderId: number;
      customer: {
        customerId: number;
      };
      addressId: number;
      addresses: [];
    };
  };
  navigation: {
    addressMode: string;
  };
}

const mapState = (state: ImapState) => {
  return {
    appState: state.appState,
    order: state.order.orderData,
    navigation: state.navigation,
  };
};
const mapDispatch = {
  orderSetContent: (content: object) => ({
    type: DT.orderSetContent,
    content: content,
  }),
  setAddressMode: (mode: string) => ({
    type: DT.setAddressMode,
    addressMode: mode,
  }),
  setNetworkError: (action: boolean) => ({
    type: DT.setNetworkError,
    networkError: action,
  }),
  setPreloader: (action: boolean) => ({
    type: DT.setPreloader,
    preloader: action,
  }),
};

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(EditAddress);
