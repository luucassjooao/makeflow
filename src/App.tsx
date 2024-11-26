import { Fragment, useState } from "react";
import { Button } from "./components/ui/button";

interface IOptions {
  id: number;
  label: string;
  layer: number;
  ref?: number;
  visible: boolean;
  observable?: boolean;
  phrase?: string;
}

interface IChildrens {
  mainOption: string;
  childrens: Array<IOptions[]>;
}

export default function App() {
  const [options, setOptions] = useState<IOptions[]>([
    {
      id: 1,
      layer: 1,
      label: "op1",
      visible: true,
    },
    {
      id: 2,
      layer: 1,
      label: "op2 ",
      visible: true,
    },
    {
      id: 2,
      layer: 2,
      label: "op P1",
      ref: 1,
      visible: false,
    },
    {
      id: 4,
      layer: 2,
      label: "op P2",
      ref: 1,
      visible: false,
    },
    {
      id: 5,
      layer: 2,
      label: "op P3",
      ref: 1,
      visible: false,
    },
    {
      id: 6,
      layer: 3,
      label: "op LL2",
      ref: 2,
      visible: false,
    },
    {
      id: 7,
      layer: 3,
      label: "op PPP3",
      ref: 5,
      visible: false,
    },
    {
      id: 8,
      layer: 3,
      label: "OBservação",
      ref: 5,
      visible: false,
      observable: true,
    },
    {
      id: 9,
      layer: 4,
      label: "op PPP3 DEPOIS",
      ref: 7,
      visible: false,
    },
  ]);
  const [optionsChildrens, setOptionsChildrens] = useState<IChildrens>({
    mainOption: "",
    childrens: [],
  });

  function handleClickOption(option: string) {
    const findOption = options.find((item) => item.label === option);
    const findChildres = options.filter((item) => item.ref === findOption?.id);

    if (findOption && findOption.layer === 1) {
      return setOptionsChildrens({
        mainOption: findOption.label,
        childrens: findChildres.length > 0 ? [findChildres] : [],
      });
    }

    if (findOption && findOption.layer !== 1) {
      if (optionsChildrens?.mainOption !== findOption.label) {
        const lastArrayInOptionsChildrens =
          optionsChildrens.childrens[optionsChildrens.childrens.length - 1];

        if (
          !lastArrayInOptionsChildrens ||
          lastArrayInOptionsChildrens.length === 0
        )
          return;

        const lastObjtInLastArrayInOptionsChildrens =
          lastArrayInOptionsChildrens[lastArrayInOptionsChildrens.length - 1];

        if (findOption.layer > lastObjtInLastArrayInOptionsChildrens.layer) {
          setOptionsChildrens((prevState) => ({
            mainOption: findOption.label,
            childrens:
              findChildres.length > 0
                ? [...prevState.childrens, findChildres]
                : [...prevState.childrens],
          }));
          return;
        }

        const newChildrens: IChildrens["childrens"] = [];
        if (findOption.layer <= lastObjtInLastArrayInOptionsChildrens.layer) {
          const filterLayersOfOthersLayers = optionsChildrens.childrens;

          for (let i = 0; i < filterLayersOfOthersLayers.length; i++) {
            const children = filterLayersOfOthersLayers[i];
            const childresLayers: IOptions[] = [];

            for (let j = 0; j < children.length; j++) {
              const currentChildren = children[j];
              if (
                currentChildren.layer < findOption.layer ||
                currentChildren.layer === findOption.layer
              ) {
                childresLayers.push(currentChildren);
              }
            }

            if (childresLayers.length > 0) {
              newChildrens.push(childresLayers);
            }
          }

          setOptionsChildrens({
            mainOption: findOption.label,
            childrens: [
              ...newChildrens,
              ...(findChildres.length > 0 ? [findChildres] : []),
            ],
          });
        }
      }
    }
  }

  return (
    <Fragment>
      <div>
        <div>
          {options.map((option) => (
            <Fragment key={Math.random()}>
              {option.visible && option.layer === 1 && (
                <button
                  type="button"
                  onClick={() => handleClickOption(option.label)}
                  key={Math.random()}
                >
                  {option.label}
                </button>
              )}
            </Fragment>
          ))}
        </div>
        <div>
          {optionsChildrens?.childrens.map((option, index) => (
            <div key={Math.random()}>
              <span>{index}</span>
              {option.map((item) => (
                <Fragment key={Math.random()}>
                  {item.observable ? (
                    <h2>Obs: {item.label}</h2>
                  ) : (
                    <button onClick={() => handleClickOption(item.label)}>
                      {item.label}
                    </button>
                  )}
                </Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>
      <Button>FDSFSDFSFSDFSD</Button>
    </Fragment>
  );
}
