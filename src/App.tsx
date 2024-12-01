import { Fragment, useState } from "react";
import { Button } from "./components/ui/button";

interface IOptions {
  id: number;
  label: string;
  layer: number;
  ref?: number;
  visible: boolean;
  observable?: boolean;
  phrase: string;
}

interface IChildrens {
  mainOption: string;
  childrens: Array<IOptions[]>;
}

interface IPhrasesObj {
  phrases: string;
  layer: number;
}

export default function App() {
  const [options, setOptions] = useState<IOptions[]>([
    {
      id: 1,
      layer: 1,
      label: "op1",
      visible: true,
      phrase: 'escolheu a opção 1',
    },
    {
      id: 2,
      layer: 1,
      label: "op2 ",
      visible: true,
      phrase: 'escolheu a opção 2',
    },
    {
      id: 2,
      layer: 2,
      label: "op P1",
      ref: 1,
      visible: false,
      phrase: 'escolheu a opção op P1',
    },
    {
      id: 4,
      layer: 2,
      label: "op P2",
      ref: 1,
      visible: false,
      phrase: 'escolheu a opção op P2',
    },
    {
      id: 5,
      layer: 2,
      label: "op P3",
      ref: 1,
      visible: false,
      phrase: 'escolheu a opção op P3',
    },
    {
      id: 6,
      layer: 3,
      label: "op LL2",
      ref: 2,
      visible: false,
      phrase: 'escolheu a opção op LL2',
    },
    {
      id: 7,
      layer: 3,
      label: "op PPP3",
      ref: 5,
      visible: false,
      phrase: 'escolheu a opção op P´P3',
    },
    {
      id: 10,
      layer: 3,
      label: "op PPP3 lado",
      ref: 5,
      visible: false,
      phrase: 'escolheu a opção op PPP3 lado',
    },
    {
      id: 8,
      layer: 3,
      label: "OBservação",
      ref: 5,
      visible: false,
      observable: true,
      phrase: ''
    },
    {
      id: 9,
      layer: 4,
      label: "op PPP3 DEPOIS",
      ref: 7,
      visible: false,
      phrase: 'escolheu a opção op PPP3 DEPOIS',
    },
  ]);
  const [optionsChildrens, setOptionsChildrens] = useState<IChildrens>({
    mainOption: "",
    childrens: [],
  });
  const [theContext, setTheContext] = useState<IPhrasesObj[]>([]);

  console.log(optionsChildrens)

  function handleClickOption(option: string) {
    const findOption = options.find((item) => item.label === option);
    const findChildres = options.filter((item) => item.ref === findOption?.id);

    if (findOption && findOption.layer === 1) {
      setOptionsChildrens({
        mainOption: findOption.label,
        childrens: findChildres.length > 0 ? [findChildres] : [],
      });

      return setTheContext([{
        phrases: findOption.phrase, layer: findOption.layer
      }])
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

          if (findOption.layer >= lastObjtInLastArrayInOptionsChildrens.layer) {
          console.log("aq")
          setOptionsChildrens((prevState) => ({
            mainOption: findOption.label,
            childrens:
              findChildres.length > 0
                ? [...prevState.childrens, findChildres]
                : [...prevState.childrens],
          }));
          setTheContext((prevState) => {
            const filterMinorLayers = prevState.filter((minor) => minor.layer < findOption.layer)

            return filterMinorLayers.concat({ phrases: findOption.phrase, layer: findOption.layer });
          });
          return;
        }

        const newChildrens: IChildrens["childrens"] = [];
        if (findOption.layer < lastObjtInLastArrayInOptionsChildrens.layer) {
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
          setTheContext((prevState) => {
            const filterMinorLayers = prevState.filter((minor) => minor.layer < findOption.layer)

            return filterMinorLayers.concat({ phrases: findOption.phrase, layer: findOption.layer });
          });
        }
      }
    }
  }

  return (
    <div>
    <div className="p-6 bg-purple-600" >
      CHOOSEEEEE
    </div>
    <div className="flex justify-evenly" >
      <div className="" >
        <h1>ESCOLHAS</h1>
        <div>
          {options.map((option) => (
            <Fragment key={Math.random()}>
              {option.visible && option.layer === 1 && (
                <button
                  type="button"
                  onClick={() => handleClickOption(option.label)}
                  key={Math.random()}
                  className="p-3 bg-green-900 m-2 rounded-lg"
                >
                  {option.label}
                </button>
              )}
            </Fragment>
          ))}
        </div>
        <div>
          {optionsChildrens?.childrens.map((option, index) => {
            const opacity = 100 - index * 20;
            const maxOpacity = Math.max(opacity, 10);
            return (
              <div key={Math.random()} className={`bg-opacity-${maxOpacity}`} >
              {option.map((item) => (
                <Fragment key={Math.random()}>
                  {item.observable ? (
                    <h2 className="p-2 bg-purple-900 rounded-lg m-2" >Obs: {item.label}</h2>
                  ) : (
                    <button onClick={() => handleClickOption(item.label)} className={`p-3 bg-red-900 rounded-lg m-2`} >
                      {item.label}
                    </button>
                  )}
                </Fragment>
              ))}
            </div>
            )
          })}
        </div>
      </div>
      <div className="" >
        <h1>FRASES JÁ PRONTAS</h1>
        {theContext.map((i) => (
          <div key={Math.random()} >
            <h1>{i.phrases}</h1>
          </div>
        ))}
      <Button onClick={() => navigator.clipboard.writeText(theContext.map(({phrases}) => phrases).join(" - "))} >
        Copy
      </Button>
      </div>
    </div>
    </div>
  );
}