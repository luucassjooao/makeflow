import { Fragment, useState } from "react";
import { Button } from "../components/ui/button";

interface IOptions {
  id: number;
  label: string;
  layer: number;
  ref?: number;
  type:
    | "main"
    | "step"
    | "stepObservation"
    | "finishObservation"
    | "OSObservation";
  phrase: string;
}

// REFERENCIA DO PAI, 1 LAYER + PAI, LABEL, TYPE, PHRASE SE FOR STEP

interface IChildrens {
  mainOption: string;
  childrens: Array<IOptions[]>;
}

interface IPhrasesObj {
  phrases: string;
  layer: number;
}

export function Chose() {
  const [options, setOptions] = useState<IOptions[]>([
    {
      id: 1,
      layer: 1,
      label: "op1",
      phrase: "escolheu a opção 1",
      type: "main",
    },
    {
      id: 2,
      layer: 1,
      label: "op2 ",
      phrase: "escolheu a opção 2",
      type: "main",
    },
    {
      id: 2,
      layer: 2,
      label: "op P1",
      ref: 1,
      phrase: "escolheu a opção op P1",
      type: "step",
    },
    {
      id: 4,
      layer: 2,
      label: "op P2",
      ref: 1,
      phrase: "escolheu a opção op P2",
      type: "step",
    },
    {
      id: 5,
      layer: 2,
      label: "op P3",
      ref: 1,
      phrase: "escolheu a opção op P3",
      type: "step",
    },
    {
      id: 8,
      layer: 3,
      label: "OBservação step",
      ref: 5,
      type: "stepObservation",
      phrase: "",
    },
    {
      id: 9,
      layer: 3,
      label: "OBservação Finish",
      ref: 5,
      type: "finishObservation",
      phrase: "",
    },
    {
      id: 10,
      layer: 3,
      label: "OBservação OS",
      ref: 5,
      type: "OSObservation",
      phrase: "",
    },
    {
      id: 11,
      layer: 4,
      label: "step observação",
      ref: 10,
      type: "step",
      phrase: "fdfdd",
    },
  ]);
  const [optionsChildrens, setOptionsChildrens] = useState<IChildrens>({
    mainOption: "",
    childrens: [],
  });
  const [theContext, setTheContext] = useState<IPhrasesObj[]>([]);

  function handleClickOption(option: string) {
    const findOption = options.find((item) => item.label === option);
    const findChildres = options.filter((item) => item.ref === findOption?.id);
    console.log({findOption})
    console.log({findChildres})

    if (findOption && findOption.layer === 1) {
      setOptionsChildrens({
        mainOption: findOption.label,
        childrens: findChildres.length > 0 ? [findChildres] : [],
      });

      return setTheContext([
        {
          phrases: findOption.phrase,
          layer: findOption.layer,
        },
      ]);
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
          setOptionsChildrens((prevState) => ({
            mainOption: findOption.label,
            childrens:
              findChildres.length > 0
                ? [...prevState.childrens, findChildres]
                : [...prevState.childrens],
          }));
          setTheContext((prevState) => {
            const filterMinorLayers = prevState.filter(
              (minor) => minor.layer < findOption.layer
            );

            return filterMinorLayers.concat({
              phrases: findOption.phrase,
              layer: findOption.layer,
            });
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
            const filterMinorLayers = prevState.filter(
              (minor) => minor.layer < findOption.layer
            );

            return filterMinorLayers.concat({
              phrases: findOption.phrase,
              layer: findOption.layer,
            });
          });
        }
      }
    }
  }

  return (
    <div>
      <div className="flex justify-evenly">
        <div className="">
          <h1 className="font-bold text-center text-3xl">ESCOLHAS</h1>
          <div className="flex flex-row justify-center items-center">
            {options.map((option) => (
              <Fragment key={Math.random()}>
                {option.type === "main" && (
                  <button
                    type="button"
                    onClick={() => handleClickOption(option.label)}
                    className="p-3 bg-[#002855] hover:bg-[#023e7d] transition-all m-2 rounded-lg"
                  >
                    {option.label}
                  </button>
                )}
              </Fragment>
            ))}
          </div>
          <div>
            {optionsChildrens?.childrens.map((option) => {
              return (
                <div key={Math.random()}>
                  {option.map((item) => (
                    <Fragment key={Math.random()} >
                      {item.type === "step" && (
                        <button
                          onClick={() => handleClickOption(item.label)}
                          className={`p-3 bg-[#560bad] hover:bg-[#7209b7] transition-all rounded-lg m-2`}
                        >
                          {item.label}
                        </button>
                      )}
                      {item.type === "stepObservation" && (
                        <button onClick={() => handleClickOption(item.label)} className="p-2 bg-[#4361ee] rounded-sm m-2">
                          Obs: {item.label}
                        </button>
                      )}
                      {item.type === "finishObservation" && (
                        <button onClick={() => handleClickOption(item.label)} className="p-2 bg-[#4cc9f0] text-black font-medium rounded-sm m-2">
                          Obs: {item.label}
                        </button>
                      )}

                      {item.type === "OSObservation" && (
                        <button onClick={() => handleClickOption(item.label)} className="p-2 bg-[#f6aa1c] text-black font-semibold rounded-sm m-2">
                          Obs: {item.label}
                        </button>
                      )}
                    </Fragment>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
        <div className="text-center">
          <h1 className="font-bold text-3xl">FRASES JÁ PRONTAS</h1>
          {theContext.map((i) => (
            <div key={Math.random()}>
              <h2 className="p-2 bg-[#979dac] text-black font-semibold rounded-sm m-2">
                {i.phrases}
              </h2>
            </div>
          ))}
          <Button
            onClick={() =>
              navigator.clipboard.writeText(
                theContext.map(({ phrases }) => phrases).join(" - ")
              )
            }
          >
            Copy
          </Button>
        </div>
      </div>
    </div>
  );
}
