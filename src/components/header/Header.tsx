import { useAuth } from "@/hooks/useAuth";
import { Link, Navigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface IFormData {
  username: string;
  password: string;
}

export function Header() {
  const { signIn, user, signedIn } = useAuth();

  const form = useForm<IFormData>({
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const [modalSignIn, setModalSignIn] = useState(false);
  console.log({user, signedIn})

  const handleSubmit = form.handleSubmit(async ({ username, password }) => {
    try {
      await signIn(username, password);
      <Navigate to="/choose" />
    } catch (error) {
      toast.error("Credenciais Inválidas.");
    } finally {
      setModalSignIn((prev) => prev !== true)
      form.reset()
    }
  });

  const formCompleted = !form.watch("username") || !form.watch("password");

  return (
    <div className="border-2 border-b-white p-3 text-center">
      {user ? (
        <>
          <Link
            to="/"
            className="p-2 bg-white hover:bg-gray-300 text-black rounded-lg m-3 hover:opacity-80 transition-all ease-out"
          >
            Escolhas
          </Link>
          {user.role === 'ADMIN' && (
            <>
              <Link
                to="/playground"
                className="p-2 bg-white hover:bg-gray-300 text-black rounded-lg m-3 hover:opacity-80 transition-all ease-out"
              >
                Playground
              </Link>
              <Button
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
            className="hover:bg-gray-300"
            type="button"
            onClick={() => setModalSignIn((prev) => prev !== true)}
          >
            Login
          </Button>
        </>
      )}

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
                {...form.register("username")}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Coloque sua senha?</Label>
              <Input
                className="border-gray-400"
                type="password"
                {...form.register("password")}
              />
            </div>

            <Button
              disabled={formCompleted || form.formState.isSubmitting}
              type="submit"
              className="mt-3 w-full"
            >
              {form.formState.isSubmitSuccessful && "Entrando..."}
              {!form.formState.isSubmitSuccessful && "Entrar"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
