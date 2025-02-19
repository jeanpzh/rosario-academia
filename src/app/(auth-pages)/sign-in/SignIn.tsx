"use client";

import React, { useState } from "react";
import styles from "./styles.module.css";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { signInAction } from "@/app/(auth-pages)/actions";
import PasswordInput from "@/components/password-input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const { push } = useRouter();
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);

  const handleRegisterClick = () => {
    setIsRightPanelActive(true);
  };

  const handleLoginClick = () => {
    setIsRightPanelActive(false);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setLoading(true);
    const res = await signInAction(formData);

    if (res?.status === 500) {
      toast.error("Error", {
        description: res.message,
      });
      setLoading(false);
      return;
    }
    setLoading(false);
    toast.success("Éxito", {
      description: "Inicio de sesión exitoso",
    });
    push(res.redirectUrl as string);
  };

  return (
    <div
      className={`${styles.signInContainer} ${isRightPanelActive ? styles.rightPanelActive : ""}`}
      id="container"
    >
      <div className={`${styles.signInFormContainer} ${styles.signInLoginContainer}`}>
        <form className={styles.signInForm} onSubmit={handleSubmit}>
          <h1 className={styles.signInTitle}>Iniciar Sesión</h1>
          <div className={styles.signInContent}>
            <Label htmlFor="email">Email</Label>
            <Input
              className={styles.signInInput}
              name="email"
              placeholder="zavaleta@gmail.com"
              required
            />
            <div className={`${styles.signInContent} text-left `}>
              <PasswordInput
                id="password"
                label="Contraseña"
                className={styles.signInInput}
                name="password"
                placeholder="Tu contraseña"
                required
              />
            </div>
            <SubmitButton pending={loading} pendingText="Loggeando ...">
              Iniciar Sesión
            </SubmitButton>
          </div>
          <span className={styles.signInText}>
            ¿No tienes una cuenta?{" "}
            <Link className={styles.signInLink} href="/sign-up">
              Regístrate
            </Link>
          </span>
          <Link className={styles.passLink} href="/forgot-password">
            ¿Olvidaste tu contraseña?
          </Link>
        </form>
      </div>

      <div className={styles.signInOverlayContainer}>
        <div className={styles.signInOverlay}>
          <div
            className={`overflow-hidden ${styles.signInOverlayPanel} ${styles.signInOverlayLeft}`}
          >
            <h1 className={styles.signInSubtitle}>
              Nada es imposible, <br /> cree en ti!
            </h1>
            <p className={styles.signInText}>
              Te ofrecemos un ambiente donde la diversión y el esfuerzo se combinan para que puedas
              desarrollar tus habilidades al máximo ¡Te esperamos en la cancha!
            </p>
            <button
              className={`${styles.signInButton} ${styles.signInGhost}`}
              id="login"
              onClick={handleLoginClick}
            >
              Anterior
              <i className={`lni lni-arrow-left ${styles.login}`}></i>
            </button>
          </div>
          <div className={`${styles.signInOverlayPanel} ${styles.signInOverlayRight}`}>
            <h1 className={styles.signInSubtitle}>
              Diviértete, <br /> disfruta el juego!
            </h1>
            <p className={styles.signInText}>
              En la Academia Rosario, creemos que el vóley es más que un deporte, es una oportunidad
              para crecer, aprender y hacer nuevos amigos.
            </p>
            <button
              className={`${styles.signInButton} ${styles.signInGhost}`}
              id="register"
              onClick={handleRegisterClick}
            >
              Siguiente
              <i className={`lni lni-arrow-right ${styles.register}`}></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
