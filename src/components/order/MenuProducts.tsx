import React, { useState, useRef } from "react";
import { connect, ConnectedProps } from "react-redux";
import { DT } from "../../redux/dispatchTypes";
import styled from "styled-components";
import { KeyboardReturn, FolderOpen, Menu } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import { Button, TextField, Grid, Typography } from "@material-ui/core";

/**
 * Компонент меню.
 * Ключевые элементы:
 *   Категрии товаров
 *   Товары
 *   Обязательные опции, радио, которыми создается новый товар ( пицца большая, пицца маленькая ) разные поззиции в приготовлении и товароучете, может быть несколько уровней
 *   Необязательные опции, чекбоксы, это добавки, в товароучет уходят как продукт непосредственно
 * */
interface IMenuProducts extends PropsFromRedux {}

const BtnMenu = styled.div<{ selected?: boolean; block?: boolean }>`
  ${(props) => props.selected && ` background-color: #fff3cd;`}
  width: 30%;
  border: 1px solid Gainsboro;
  border-radius: 5px;
  height: 7rem;
  padding: 5px;
  margin-top: 2px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-overflow: clip;
  overflow: hidden;
`;

const MenuProducts = (props: IMenuProducts) => {
  const [menuLevel, setMenuLevel] = useState<Array<number>>([0]); // текущий уровень меню // parentId для категорий  categoryId // 0- для нулевого уровня//  для продуктов число 8 знаков id //
  const [searchProduct, setSearchProduct] = useState<string>("");
  const [optionSelected, setOptionSelected] = useState<Array<IOption>>([]); // выбраные опции
  // использую для хранения значения
  const optionStep = useRef(0); // шаг выбора опции

  interface IOptionValues {
    optionValues: IOption[];
    required: number;
    optionName: string;
    optionId: number;
  }

  const optionArr = useRef<Array<IOptionValues>>([]); // список  опций на продукте

  const category =
    searchProduct.length === 0 &&
    props.init.products.category
      .filter(({ parentId }) => parentId === menuLevel[menuLevel.length - 1])
      .map(({ categoryId, name }) => (
        <BtnMenu
          key={categoryId}
          onClick={() => {
            setMenuLevel([...menuLevel, categoryId]);
          }}
        >
          <FolderOpen />
          <Typography>{name}</Typography>
        </BtnMenu>
      ));

  const filterProduct =
    (searchProduct.length === 0 &&
      props.init.products.product.filter(
        ({ categoryId }) =>
          categoryId.indexOf(menuLevel[menuLevel.length - 1]) !== -1
      )) ||
    props.init.products.product.filter((e) =>
      e.productName.toLowerCase().includes(searchProduct.toLowerCase())
    );

  const product = filterProduct.map(
    ({ productId, productName, price, options }) => {
      const required = options.some(({ required }) => required === 1);
      return (
        <BtnMenu
          block
          key={productId}
          onClick={() => {
            if (options.length > 0) {
              setSearchProduct("");
              optionStep.current = 0;
              optionArr.current = options;
              setMenuLevel([...menuLevel, productId]);
            } else {
              addProduct(productId); // опций на продукте нет добавим продукт
            }
          }}
        >
          <Typography>{productName}</Typography>
          {options.length > 0 && required ? (
            <Menu />
          ) : (
            <Typography>{price + " ₽"}</Typography>
          )}
        </BtnMenu>
      );
    }
  );

  const getOptionPriceText = (optionPrice: number, pricePrefix: string) => {
    switch (pricePrefix) {
      case "=":
        return optionPrice;
      case "+":
        return "+" + optionPrice;
      case "-":
        return "-" + optionPrice;
    }
  };

  const getOptionPrice = (opt: Array<IOption>) => {
    return opt.reduce((acc, { pricePrefix, optionPrice }) => {
      switch (pricePrefix) {
        case "=":
          acc = optionPrice;
          break;
        case "+":
          acc = acc + optionPrice;
          break;
        case "-":
          acc = acc - optionPrice;
          break;
      }
      return acc;
    }, 0);
  };

  const changeOptionSelected = (opt: { productOptionValueId: number }) => {
    let newElem = true;
    let optionIdList = optionSelected.reduce(
      (acc: any[], currentValue: { productOptionValueId: number }) => {
        if (currentValue.productOptionValueId !== opt.productOptionValueId) {
          acc.push(currentValue);
        } else {
          newElem = false;
        }
        return acc;
      },
      []
    );
    if (newElem) optionIdList = [...optionIdList, opt];
    setOptionSelected(optionIdList);
    return optionIdList;
  };

  const options =
    searchProduct.length === 0 &&
    optionArr.current.length > 0 &&
    optionArr.current[optionStep.current].optionValues.map(
      (opt: {
        productOptionValueId: number;
        productId: number;
        optionValueName: string;
        optionPrice: number;
        pricePrefix: string;
      }) => {
        //  обязательную позицию можно выбрать только одну, необязательных несколько (чекбоксы)
        const required = optionArr.current[optionStep.current].required;
        return (
          <BtnMenu
            selected={optionSelected.some(
              (e: { productOptionValueId: number }) =>
                e.productOptionValueId === opt.productOptionValueId
            )}
            block
            key={opt.productOptionValueId}
            onClick={() => {
              let optionsList = changeOptionSelected(opt);
              if (required) {
                if (optionArr.current.length - 1 > optionStep.current) {
                  // следующий уровень опций
                  optionStep.current++;
                } else {
                  // опций больше нет надо добаить позицию в заказ
                  addProduct(opt.productId, optionsList);
                }
              }
            }}
          >
            <div>{opt.optionValueName} </div>
            <div>{getOptionPriceText(opt.optionPrice, opt.pricePrefix)} ₽</div>
          </BtnMenu>
        );
      }
    );

  const optionsBefore = () => {
    if (
      optionArr.current.length > 0 &&
      optionArr.current[optionStep.current].required
    ) {
      return (
        <Alert
          severity={"warning"}
          style={{ width: "80%", textAlign: "center", marginTop: "20px" }}
        >
          Выберите опцию
        </Alert>
      );
    } else if (
      optionArr.current.length > 0 &&
      optionArr.current[optionStep.current].required === 0
    ) {
      return (
        <Alert
          severity={"warning"}
          style={{ width: "80%", textAlign: "center", marginTop: "20px" }}
        >
          Предложите клиенту добавки
        </Alert>
      );
    }
  };

  const optionsAfter = () => {
    if (
      optionArr.current.length > 0 &&
      optionArr.current[optionStep.current].required === 0
    ) {
      return (
        <div style={{ width: "80%", textAlign: "center", marginTop: "20px" }}>
          <Button
            fullWidth={true}
            variant="outlined"
            onClick={() => {
              addProduct(menuLevel[menuLevel.length - 1], optionSelected);
              menuLevelUp();
            }}
          >
            Закончить
          </Button>
        </div>
      );
    }
  };

  const menuLevelUp = () => {
    let arr = [...menuLevel];
    arr.pop(); // удаляем последний элемент
    setMenuLevel(arr);
  };

  const resetState = () => {
    optionStep.current = 0;
    optionArr.current = [];
    setOptionSelected([]);
    setSearchProduct("");
  };

  const addProduct = (id: number, options: IOption[] | never = []) => {
    const allOrderProduct = [...props.order.orderData.products]; // всё в заказе
    // массив id выбраных опций // сортировка по возростанию, удобно сравнивать
    const optionIdList =
      options &&
      options
        .reduce(
          (acc: any[], currentValue: { productOptionValueId: number }) => {
            acc.push(currentValue.productOptionValueId);
            return acc;
          },
          []
        )
        .sort();
    let selectedProduct = allOrderProduct.filter(
      (e) =>
        e.productId === id &&
        e.optionIdList.toString() === optionIdList.toString()
    )[0];
    // уникальный ключ продукта в заказе//  id продукта - id  обязательных опциий возрастанию -  id доп опций по возрастанию
    let key: string =
      id + (optionIdList.length > 0 ? "_" : "") + optionIdList.join("_");
    if (selectedProduct) {
      selectedProduct.quantity++;
      selectedProduct.total = selectedProduct.price * selectedProduct.quantity;
    } else {
      let product = props.init.products.product.filter(
        ({ productId }) => productId === id
      )[0]; // выбраный продукт в меню
      let price =
        (optionIdList.length > 0 && getOptionPrice(options) + product.price) ||
        product.price;
      let newProduct: IProduct = {
        productKey: key,
        productName: product.productName,
        categoryId: product.categoryId,
        quantity: 1,
        total: price,
        price: price,
        optionList: options,
        productId: product.productId,
        optionIdList: optionIdList,
      };
      allOrderProduct.push(newProduct);
    }
    props.orderSetContent({ products: allOrderProduct });
    props.orderSetContent({ modified: true });
    if (options.length > 0) {
      menuLevelUp();
    }
    resetState();
  };

  const buttonBackMenu = (menuLevel[menuLevel.length - 1] === 0 && (
    <Button
      variant="outlined"
      style={{ width: "20%" }}
      onClick={() => {
        props.changeMenuMode(false);
      }}
    >
      <KeyboardReturn />
    </Button>
  )) || (
    <Button
      variant="outlined"
      onClick={() => {
        menuLevelUp();
        resetState();
      }}
    >
      <KeyboardReturn />
    </Button>
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        maxHeight: "100%",
      }}
    >
      <Grid container direction="row">
        <TextField
          variant="outlined"
          color="primary"
          style={{ width: "80%" }}
          label="Поиск"
          type="search"
          onChange={(event) => {
            setSearchProduct(event.target.value);
          }}
          value={searchProduct}
        />
        {buttonBackMenu}
      </Grid>
      <Grid
        spacing={0}
        container
        direction="row"
        justify="space-around"
        style={{ overflowY: "auto", maxHeight: "100%" }}
      >
        {category}
        {product}
        {optionsBefore()}
        {options}
        {optionsAfter()}
      </Grid>
    </div>
  );
};

interface ImapState {
  order: IOrder;
  init: IInit;
}

interface IOrder {
  orderData: {
    products: IProduct[];
  };
}

interface IInit {
  products: {
    category: [];
    product: {
      categoryId: number[];
      productId: number;
      productName: string;
      price: number;
      options: {
        optionValues: IOption[];
        required: number;
        optionName: string;
        optionId: number;
      }[];
    }[];
  };
}

interface IProduct {
  productKey: string;
  productName: string;
  categoryId: number[];
  quantity: number;
  total: number;
  price: number;
  optionList: IOption[];
  productId: number;
  optionIdList: number[];
}

/**
 * Опции на продукте (пицца, тонкая толстая, добавки)
 */
interface IOption {
  optionId: number;
  optionName: string;
  required: number;
  optionValueId: number;
  productOptionValueId: number;
  productId: number;
  optionValueName: string;
  sortOrder: number;
  optionPrice: number;
  pricePrefix: string;
}

const mapState = (state: ImapState) => {
  return {
    order: state.order,
    init: state.init,
  };
};
const mapDispatch = {
  orderSetContent: (content: object) => ({
    type: DT.orderSetContent,
    content: content,
  }),
  changeMenuMode: (menuMode: boolean) => ({
    type: DT.setMenuMode,
    menuMode: menuMode,
  }),
};
const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>
export default connector(MenuProducts)