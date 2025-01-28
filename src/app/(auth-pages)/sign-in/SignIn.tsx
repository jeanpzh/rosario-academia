"use client";

import React, { useState } from "react";
import styles from "./styles.module.css";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { signInAction } from "../actions";

interface SignInProps {
  searchParams: Message;
}

const SignIn = ({ searchParams }: SignInProps) => {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);

  const handleRegisterClick = () => {
    setIsRightPanelActive(true);
  };

  const handleLoginClick = () => {
    setIsRightPanelActive(false);
  };

  return (
    <div
      className={`${styles.signInContainer} ${isRightPanelActive ? styles.rightPanelActive : ""}`}
      id="container"
    >
      <div className={`${styles.signInFormContainer} ${styles.signInLoginContainer}`}>
        <form className={styles.signInForm} action={signInAction}>
          <h1 className={styles.signInTitle}>Iniciar Sesión</h1>
          <div className={styles.signInContent}>
            <Label htmlFor="email">Email</Label>
            <Input
              className={styles.signInInput}
              name="email"
              placeholder="you@example.com"
              required
            />
            <div className={styles.signInCheckbox}>
              <Label htmlFor="password">Contraseña</Label>
            </div>
            <Input
              className={styles.signInInput}
              type="password"
              name="password"
              placeholder="Your password"
              required
            />
            <SubmitButton pendingText="Signing In...">Iniciar Sesión</SubmitButton>
            <FormMessage message={searchParams} />
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
          <div className={`${styles.signInOverlayPanel} ${styles.signInOverlayLeft}`}>
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
