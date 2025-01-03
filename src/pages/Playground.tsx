import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { PlusSquare } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import FormGroup from "@/components/FormGroup";
import { useErrors } from "@/hooks/useErrors";

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

interface IOptionToAddChildren {
  indexArrayChildren: number;
  id: number;
  label: string;
  layer: number;
  titleChildren: string;
  typeChildren: IOptions['type'];
  phraseChildren: string;
}

import { ChangeEvent } from 'react';

export type InputChange = ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>

export function Playground() {
  const [openModal, setOpenModal] = useState(false);

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
      label: "OBservação",
      ref: 5,
      type: "stepObservation",
      phrase: "",
    },
    {
      id: 9,
      layer: 3,
      label: "OBservação",
      ref: 5,
      type: "finishObservation",
      phrase: "",
    },
    {
      id: 10,
      layer: 3,
      label: "OBservação",
      ref: 5,
      type: "OSObservation",
      phrase: "",
    },
  ]);
  const [optionsChildrens, setOptionsChildrens] = useState<IChildrens>({
    mainOption: "",
    childrens: [],
  });
  const [optionToAddChildren, setOptionToAddChildren] = useState<IOptionToAddChildren>({
    id: 0,
    label: '',
    layer: 0,
    indexArrayChildren: 0,
    phraseChildren: '',
    titleChildren: '',
    typeChildren: 'step'
  });

  const {
    errors,
    getErrorMessageByFieldName,
    removeError,
    setError
  } = useErrors();

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

        if (findOption.layer >= lastObjtInLastArrayInOptionsChildrens.layer) {
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
        }
      }
    }
  }

  function handleAddNewChildrenInSpecificArrayLayer() {
    console.log({ optionToAddChildren })

    const fds = Math.random();
    const obj: IOptions = {
      id: fds,
      layer: optionToAddChildren!.indexArrayChildren,
      label: `${optionToAddChildren!.label} - ${fds}`,
      ref: optionToAddChildren!.id,
      phrase: `${optionToAddChildren!.label} - ${fds}`,
      type: "step",
    }
    setOptions((prevState) => [...prevState, obj])

    console.log(options)
  }

  function addNewChildrenModal(id: number, indexArrayChildren?: number) {
    const findOption = options.find((i) => i.id === id);

    if (!findOption) {
      toast('fail')
      return;
    }
    toast('success')

    const obj: IOptionToAddChildren = {
      id: findOption.id,
      label: findOption.label,
      layer: findOption.layer,
      indexArrayChildren: indexArrayChildren || findOption.layer + 1,
      phraseChildren: '',
      titleChildren: '',
      typeChildren: 'step'
    }

    setOptionToAddChildren(obj);

    setOpenModal(prevState => prevState !== true)
  }

  function handleChangeTitle(event: InputChange) {
    const { value } = event.target;

    if (!value) {
      setError({ field: 'title', message: 'Dê um titulo para essa opção!' });
    } else {
      removeError({ fieldName: 'title' });
    }
    setOptionToAddChildren((prev) => {
      const title = event.target.value;
      return { ...prev, title };
    });
  }

  const filterMainOptions = options.filter((i) => i.type === "main");

  return (
    <div>
      <h1 className="text-center text-3xl font-bold mt-3">
        Opções disponiveis
      </h1>

      <div className="items-center justify-center flex-row flex">
        <div>
          <div className="flex">
            {filterMainOptions.map((option) => (
              <div
                className="items-center justify-center flex flex-col"
                key={Math.random()}
              >
                <button
                  type="button"
                  onClick={() => handleClickOption(option.label)}
                  className="p-3 bg-[#002855] hover:bg-[#023e7d] transition-all m-2 rounded-lg"
                >
                  {option.label}
                </button>
                <button>
                  <PlusSquare color="red" onClick={() => addNewChildrenModal(option.id)} />
                </button>
              </div>
            ))}
          </div>
          <div>
            {optionsChildrens?.childrens.map((option) => {
              return (
                <div key={Math.random()} className="flex">
                  {option.map((item, indexArrayChildren) => (
                    <div className="items-center justify-center flex flex-col" key={Math.random()}>
                      {item.type === "step" && (
                        <button
                          onClick={() => handleClickOption(item.label)}
                          className={`p-3 bg-[#560bad] hover:bg-[#7209b7] transition-all rounded-lg m-2`}
                        >
                          {item.label}
                        </button>
                      )}
                      {item.type === "stepObservation" && (
                        <h2 className="p-2 bg-[#4361ee] rounded-sm m-2">
                          Obs: {item.label}
                        </h2>
                      )}
                      {item.type === "finishObservation" && (
                        <h2 className="p-2 bg-[#4cc9f0] text-black font-medium rounded-sm m-2">
                          Obs: {item.label}
                        </h2>
                      )}

                      {item.type === "OSObservation" && (
                        <h2 className="p-2 bg-[#f6aa1c] text-black font-semibold rounded-sm m-2">
                          Obs: {item.label}
                        </h2>
                      )}
                      <button className="block items-center justify-center">
                        <PlusSquare color="red" onClick={() => addNewChildrenModal(item.id, indexArrayChildren)} />
                      </button>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Dialog
        open={openModal}
        onOpenChange={() => setOpenModal((prev) => prev !== true)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Então voce quer adicionar mais opções?</DialogTitle>
            <DialogDescription>
              Voce vai adicionar uma opção filho na opção "{optionToAddChildren?.label}", na
              camada "{optionToAddChildren!.layer + 1}"
            </DialogDescription>
          </DialogHeader>
          {/* REFERENCIA DO PAI, 1 LAYER + PAI, LABEL, TYPE, PHRASE SE FOR STEP */}

          <FormGroup error={getErrorMessageByFieldName({ fieldName: 'title' })!} >
            <span>Qual vai ser o titulo dessa opção ?</span>
            <Input className="border-gray-400" onChange={handleChangeTitle} />
          </FormGroup>

          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Tipo de opção" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dark">Step</SelectItem>
              <SelectItem value="system">Observação Step</SelectItem>
              <SelectItem value="system">Observação de Finalização</SelectItem>
              <SelectItem value="system">OS</SelectItem>
            </SelectContent>
          </Select>

          <span>Oque vai ser descrito no chamado?</span>
          <Input className="border-gray-400" />

          <Button onClick={
            () => handleAddNewChildrenInSpecificArrayLayer()
            } >Salvar</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
