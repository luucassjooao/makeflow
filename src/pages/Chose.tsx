import { Fragment, useState } from "react";
import { Button } from "../components/ui/button";
import { cn } from "@/lib/utils";

interface IOptions {
  id: number;
  label: string;
  layer: number;
  ref?: number;
  type:
    | "main"
    | "step"
    | "observation"
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
      id: 6,
      layer: 3,
      label: "op P3 PPP",
      ref: 5,
      phrase: "escolheu a opção op P3",
      type: "step",
    },
    {
      id: 7,
      layer: 4,
      label: "op P444",
      ref: 6,
      phrase: "escolheu a opção op P3",
      type: "step",
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
                    className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                  >
                    {option.label}
                  </button>
                )}
              </Fragment>
            ))}
          </div>
          <div>
            {optionsChildrens?.childrens.map((option, index) => {
              const isCurrent = optionsChildrens.childrens.length === (index + 1)
              // console.log(optionsChildrens.childrens.length === index + 1, option[0].label)
              return (
                <div key={Math.random()} className={cn(isCurrent ? 'bg-red-500' : 'bg-white')}>
                  {option.map((item) => (
                    <Fragment key={Math.random()} >
                      {item.type === "step" && (
                        <button
                          onClick={() => handleClickOption(item.label)}
                          className={`p-3 bg-white hover:bg-gray-200 text-black font-semibold transition-all rounded-lg m-2`}
                        >
                          {item.label}
                        </button>
                      )}
                      {item.type === "observation" && (
                        <button onClick={() => handleClickOption(item.label)} className="p-2 bg-[#4361ee] rounded-sm m-2">
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
