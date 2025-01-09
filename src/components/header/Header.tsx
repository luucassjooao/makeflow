import { useAuth } from "@/hooks/useAuth";
import { Link, Navigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { UserService } from "@/service/UserService";

interface IFormDataSignIn {
  username: string;
  password: string;
}

interface IFormDataAddNewUser {
  username: string;
  email: string;
  roleId: string;
}

export function Header() {
  const { signIn, user, signedIn } = useAuth();

  const formSignIn = useForm<IFormDataSignIn>({
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const [modalSignIn, setModalSignIn] = useState(false);

  const formAddNewUser = useForm<IFormDataAddNewUser>({
    defaultValues: {
      username: '',
      email: '',
      roleId: ''
    }
  })
  const [modalAddNewUser, setModalAddNewUser] = useState(false);
  const [isLoadingAddNewUser, setIsLoadingAddNewUser] = useState(false);

  const handleSubmit = formSignIn.handleSubmit(async ({ username, password }) => {
    try {
      await signIn(username, password);
      <Navigate to="/choose" />
    } catch (error) {
      toast.error("Credenciais Inválidas.");
    } finally {
      setModalSignIn((prev) => prev !== true)
      formSignIn.reset()
    }
  });

  const formCompletedSignIn = !formSignIn.watch("username") || !formSignIn.watch("password");
  const formCompletedAddNewUser = 
    !formAddNewUser.watch('username') || 
    !formAddNewUser.watch('email') || 
    !formAddNewUser.watch('roleId')

  const handleAddNewUser = formAddNewUser.handleSubmit(async ({ username, email, roleId }) => {
    setIsLoadingAddNewUser(true);
    try {
      await UserService.addNewUser({ username, email, roleId })
      toast(`${formAddNewUser.getValues('username')} foi adicionado! Solicite que se registre pelo email`)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoadingAddNewUser(false);
      formAddNewUser.reset();
    }
  })

  return (
    <div className="border-2 border-b-white p-3 text-center">
      {true ? (
        <>
          <Link
            to="/"
          >
            <Button className="font-semibold p-2 bg-white hover:bg-gray-300 text-black rounded-lg m-3 hover:opacity-80 transition-all ease-out" >
              Escolhas
            </Button>
          </Link>
          {true && (
            <>
              <Link
                to="/playground"
                >
                <Button className="font-semibold p-2 bg-white hover:bg-gray-300 text-black rounded-lg m-3 hover:opacity-80 transition-all ease-out" >
                  Playground
                </Button>
              </Link>
              <Button
                onClick={() => setModalAddNewUser((prev) => prev !== true)}
                type="button"
                className="p-2 bg-white hover:bg-gray-300 text-black rounded-lg m-3 hover:opacity-80 transition-all ease-out"
              >
                Adicionar Usuario
              </Button>
            </>
          )}
        </>
      ) : (
        <>
          <Button
            className="p-2 bg-white hover:bg-gray-300 text-black rounded-lg m-3 hover:opacity-80 transition-all ease-out"
            type="button"
            onClick={() => setModalSignIn((prev) => prev !== true)}
          >
            Login
          </Button>
        </>
      )}

      {/* LOGIN */}
      <Dialog
        open={modalSignIn}
        onOpenChange={() => setModalSignIn((prev) => prev !== true)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login</DialogTitle>
          </DialogHeader>
          {/* REFERENCIA DO PAI, 1 LAYER + PAI, LABEL, TYPE, PHRASE SE FOR STEP */}

          <form onSubmit={handleSubmit}>
            <div className="space-y-1">
              <Label htmlFor="username">Coloque seu username</Label>
              <Input
                className="border-gray-400"
                type="text"
                {...formSignIn.register("username")}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Coloque sua senha?</Label>
              <Input
                className="border-gray-400"
                type="password"
                {...formSignIn.register("password")}
              />
            </div>

            <Button
              disabled={formCompletedSignIn || formSignIn.formState.isSubmitting}
              type="submit"
              className="mt-3 w-full"
            >
              {formSignIn.formState.isSubmitSuccessful && "Entrando..."}
              {!formSignIn.formState.isSubmitSuccessful && "Entrar"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* ADD NEW USER */}
      <Dialog
        open={modalAddNewUser}
        onOpenChange={() => setModalSignIn((prev) => prev !== true)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar um novo usuario ao sistema</DialogTitle>
            <DialogDescription>Tenha certeza do que voce irá fazer</DialogDescription>
          </DialogHeader>
          {/* REFERENCIA DO PAI, 1 LAYER + PAI, LABEL, TYPE, PHRASE SE FOR STEP */}

          <form onSubmit={handleAddNewUser}>
            <div className="space-y-1">
              <Label htmlFor="username">Qual o username dessa pessoa?</Label>
              <Input
                className="border-gray-400"
                type="text"
                {...formAddNewUser.register("username")}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Qual o email dessa pessoa?</Label>
              <Input
                className="border-gray-400"
                type="password"
                {...formAddNewUser.register("email")}
              />
            </div>

            <div className="mt-3" >
              <Select onValueChange={(value: any) => formAddNewUser.register('roleId', value)} >
                <SelectTrigger>
                  <SelectValue placeholder="Qual o tipo desse pessoa?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="step">USER</SelectItem>
                  <SelectItem value="stepObservation">
                    ADMIN
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              disabled={formCompletedAddNewUser || formAddNewUser.formState.isSubmitting}
              type="submit"
              className="mt-3 w-full"
            >
              {formAddNewUser.formState.isSubmitSuccessful && "Registrando..."}
              {!formAddNewUser.formState.isSubmitSuccessful && "Registrar"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
