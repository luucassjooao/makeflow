import { useEffect, useState } from "react";
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
import { Pencil, PlusSquare } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

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

interface IOptionToAddChildren {
  indexArrayChildren: number;
  id: number;
  label: string;
  layer: number;
  titleChildren: string;
  typeChildren: IOptions["type"];
  phraseChildren: string;
}

import { ChangeEvent } from "react";
import { Controller, useForm } from "react-hook-form";

export type InputChange = ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>;

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
      id: 3,
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
      label: "OBservação Step",
      ref: 5,
      type: "stepObservation",
      phrase: "",
    },
    {
      id: 9,
      layer: 3,
      label: "OBservação FINSIHS",
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
  ]);
  
  const [optionsChildrens, setOptionsChildrens] = useState<IChildrens>({
    mainOption: "",
    childrens: [],
  });

  const formOptionToAddChildren = useForm<IOptionToAddChildren>({
    defaultValues: {
      id: 0,
      label: "",
      layer: 0,
      indexArrayChildren: 0,
      phraseChildren: "",
      titleChildren: "",
      typeChildren: "step",
    },
  });
  const [toAddChildrenUse, setToAddChildrenUse] = useState(false);

  const mainOptionToAdd = useForm<IOptions>({
    defaultValues: {
      id: Math.random(),
      layer: 1,
      label: "",
      phrase: "",
      type: "main",
    },
  });
  const [openModalMainOption, setOpenModalMainOption] = useState(false);

  const changeOption = useForm<IOptions>({
    defaultValues: {
      id: 0,
      layer: 1,
      label: "",
      phrase: "",
      type: "main",
    },
  });
  const [modalChangeOption, setModalChangeOption] = useState<{
    isMain: boolean;
    open: boolean;
  }>({
    isMain: false,
    open: false,
  });

  useEffect(() => {
    // handleClickOption(formOptionToAddChildren.getValues().label);
    setOpenModal(false);
    setToAddChildrenUse(false);

    formOptionToAddChildren.reset();
  }, [toAddChildrenUse]);

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

  const handleAddNewChildrenInSpecificArrayLayer =
    formOptionToAddChildren.handleSubmit(async (optionInfos) => {
      const {
        indexArrayChildren,
        titleChildren,
        id,
        phraseChildren,
        typeChildren,
      } = optionInfos;

      if (!typeChildren) {
        toast("Type children nao tem");
        setOpenModal(false);
        return;
      }

      const obj: IOptions = {
        id: Math.random(),
        layer: indexArrayChildren,
        label: titleChildren,
        ref: id,
        phrase: phraseChildren,
        type: typeChildren,
      };
      setOptions((prevState) => [...prevState, obj]);
      setToAddChildrenUse(true);
    });

  const handleAddNewMainOption = mainOptionToAdd.handleSubmit(
    async (optionInfos) => {
      setOptions((prev) => [...prev, optionInfos]);
      setOpenModalMainOption(false);
      mainOptionToAdd.reset();
    }
  );

  function addNewChildrenModal(id: number) {
    const findOption = options.find((i) => i.id === id);

    if (!findOption) {
      toast("fail");
      return;
    }

    formOptionToAddChildren.setValue("id", findOption.id);
    formOptionToAddChildren.setValue("label", findOption.label);
    formOptionToAddChildren.setValue("layer", findOption.layer + 1);

    setOpenModal((prevState) => prevState !== true);
  }

  function handleChangeOption(id: number) {
    const findOption = options.find((item) => item.id === id);
    if (!findOption) {
      return;
    }
    setModalChangeOption({
      isMain: findOption.type === "main" ? true : false,
      open: true,
    });
  }

  const saveChangesOnOption = changeOption.handleSubmit(async (infos) => {
    setOptions((prevState) => {
      return prevState.map((item) =>
        item.id === changeOption.getValues("id") ? { ...item, ...infos } : item
      );
    });
    setModalChangeOption({
      isMain: false,
      open: false,
    });
    setOptionsChildrens({ mainOption: "", childrens: [] });
    changeOption.reset();
  });

  const filterMainOptions = options.filter((i) => i.type === "main");

  const completedModalFormMain =
    !mainOptionToAdd.watch("label") && !mainOptionToAdd.watch("phrase");
  const formCompleted =
    !formOptionToAddChildren.watch("titleChildren") ||
    !formOptionToAddChildren.watch("typeChildren") ||
    !formOptionToAddChildren.watch("phraseChildren");

  return (
    <div>
      <h1 className="text-center text-3xl font-bold mt-3">
        Opções disponiveis
      </h1>

      <div className="items-center justify-center flex-row flex">
        <div>
          <div
            className="items-center justify-center flex flex-col"
            key={Math.random()}
          >
            <Button
              className="mt-2"
              onClick={() => setOpenModalMainOption(true)}
            >
              Adicionar uma opção principal
            </Button>
          </div>
          <div className="flex justify-center">
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
                <div>
                  <button>
                    <PlusSquare
                      color="red"
                      onClick={() => addNewChildrenModal(option.id)}
                    />
                  </button>
                  <button>
                    <Pencil
                      color="green"
                      onClick={() => handleChangeOption(option.id)}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div>
            {optionsChildrens?.childrens.map((option) => {
              return (
                <div key={Math.random()} className="flex justify-center">
                  {option.map((item) => (
                    <div
                      className="items-center justify-center flex flex-col"
                      key={Math.random()}
                    >
                      {item.type === "step" && (
                        <button
                          onClick={() => handleClickOption(item.label)}
                          className={`p-3 bg-[#560bad] hover:bg-[#7209b7] transition-all rounded-lg m-2`}
                        >
                          {item.label}
                        </button>
                      )}
                      {item.type === "stepObservation" && (
                        <button
                          onClick={() => handleClickOption(item.label)}
                          className="p-2 bg-[#4361ee] rounded-sm m-2"
                        >
                          Obs: {item.label}
                        </button>
                      )}
                      {item.type === "finishObservation" && (
                        <button
                          onClick={() => handleClickOption(item.label)}
                          className="p-2 bg-[#4cc9f0] text-black font-medium rounded-sm m-2"
                        >
                          Obs: {item.label}
                        </button>
                      )}

                      {item.type === "OSObservation" && (
                        <button
                          onClick={() => handleClickOption(item.label)}
                          className="p-2 bg-[#f6aa1c] text-black font-semibold rounded-sm m-2"
                        >
                          Obs: {item.label}
                        </button>
                      )}
                      <div className="flex">
                        <button className="block items-center justify-center">
                          <PlusSquare
                            color="red"
                            onClick={() => addNewChildrenModal(item.id)}
                          />
                        </button>
                        <button>
                          <Pencil
                            color="green"
                            onClick={() => handleChangeOption(item.id)}
                          />
                        </button>
                      </div>
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
              Voce vai adicionar uma opção filho na opção "
              {formOptionToAddChildren.getValues().label}", na camada "
              {formOptionToAddChildren.getValues().layer + 1}"
            </DialogDescription>
          </DialogHeader>
          {/* REFERENCIA DO PAI, 1 LAYER + PAI, LABEL, TYPE, PHRASE SE FOR STEP */}

          <form onSubmit={handleAddNewChildrenInSpecificArrayLayer}>
            <span>Qual vai ser o titulo dessa opção ?</span>
            <Input
              className="border-gray-400 mb-3"
              type="text"
              {...formOptionToAddChildren.register("titleChildren")}
            />

            <Controller
              name="typeChildren"
              control={formOptionToAddChildren.control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de opção" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="step">Step</SelectItem>
                    <SelectItem value="stepObservation">
                      Observação Step
                    </SelectItem>
                    <SelectItem value="finishObservation">
                      Observação de Finalização
                    </SelectItem>
                    <SelectItem value="OSObservation">OS</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />

            <span>Oque vai ser descrito no chamado?</span>
            <Input
              className="border-gray-400"
              type="text"
              {...formOptionToAddChildren.register("phraseChildren")}
            />

            <Button
              className="mt-3 w-full"
              type="submit"
              disabled={formCompleted}
            >
              Salvar
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openModalMainOption}
        onOpenChange={() => setOpenModalMainOption((prev) => prev !== true)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Então voce quer adicionar mais uma Opção principal?
            </DialogTitle>
          </DialogHeader>
          {/* REFERENCIA DO PAI, 1 LAYER + PAI, LABEL, TYPE, PHRASE SE FOR STEP */}

          <form onSubmit={handleAddNewMainOption}>
            <span>Qual vai ser o titulo dessa opção ?</span>
            <Input
              className="border-gray-400"
              type="text"
              {...mainOptionToAdd.register("label")}
            />

            <span>Oque vai ser descrito no chamado?</span>
            <Input
              className="border-gray-400"
              type="text"
              {...mainOptionToAdd.register("phrase")}
            />

            <Button
              disabled={completedModalFormMain}
              type="submit"
              className="mt-3 w-full"
            >
              Salvar
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={modalChangeOption.open}
        onOpenChange={() =>
          setModalChangeOption((prev) => ({
            ...prev,
            open: prev.open !== true,
          }))
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Então voce quer mudar informações de alguma opção?
            </DialogTitle>
            <DialogDescription>
              Pense antes de mudar as informações dessa opção
            </DialogDescription>
          </DialogHeader>
          {/* REFERENCIA DO PAI, 1 LAYER + PAI, LABEL, TYPE, PHRASE SE FOR STEP */}

          <form onSubmit={saveChangesOnOption}>
            <span>O titulo dessa opção irá mudar?</span>
            <Input
              className="border-gray-400"
              type="text"
              {...changeOption.register("label")}
            />

            {!modalChangeOption.isMain && (
              <Select
                onValueChange={(value: any) =>
                  changeOption.register("type", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="O tipo dessa opção irá mudar?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="step">Step</SelectItem>
                  <SelectItem value="stepObservation">
                    Observação Step
                  </SelectItem>
                  <SelectItem value="finishObservation">
                    Observação de Finalização
                  </SelectItem>
                  <SelectItem value="OSObservation">OS</SelectItem>
                </SelectContent>
              </Select>
            )}

            <span>Oque vai ser descrito no chamado?</span>
            <Input
              className="border-gray-400"
              type="text"
              {...changeOption.register("phrase")}
            />

            <Button type="submit" className="mt-3 w-full">
              Salvar
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
