"use client";

import Image from "next/image";
import { useReducer, useMemo } from "react";
import { Label } from "@/components/ui/label"; // Asegúrate de que este import sea correcto
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// --- Tipos y Estado Inicial ---
type PaymentMethod = "NEQUI" | "DAVIPLATA" | "PSE";
type FormState = {
  selectedMethod: PaymentMethod | null;
};

const initialState: FormState = {
  selectedMethod: null,
};

function formReducer(
  state: FormState,
  action: { type: string; payload?: any }
): FormState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.payload.field]: action.payload.value };
    default:
      return state;
  }
}

// --- Componente Principal ---
export default function DonarSection() {
  const [state, dispatch] = useReducer(formReducer, initialState);

  const setField = (field: keyof FormState, value: any) => {
    dispatch({ type: "SET_FIELD", payload: { field, value } });
  };

  const paymentMethods = [
    {
      id: "NEQUI" as const,
      name: "Nequi",
      logo: "https://logowik.com/content/uploads/images/nequi8774.logowik.com.webp",
    },
    {
      id: "DAVIPLATA" as const,
      name: "Daviplata",
      logo: "https://logowik.com/content/uploads/images/daviplata1465.jpg",
    },
    {
      id: "PSE" as const,
      name: "PSE",
      logo: "https://bancoserfinanza.com/wp-content/uploads/2019/03/pse.png",
    },
  ];

  return (
    <section id="donar" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="w-full max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-primary">Haz tu Donación</h2>
            <p className="text-muted-foreground mt-2">
              Este espacio esta desarrollo no esta funcionado
            </p>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <Label className="font-semibold text-lg">
                Elige el canal de pago
              </Label>
              <RadioGroup
                onValueChange={(value) =>
                  setField("selectedMethod", value as PaymentMethod)
                }
                className="grid grid-cols-3 gap-4"
                value={state.selectedMethod || ""}
              >
                {paymentMethods.map((method) => (
                  <div key={method.id}>
                    <RadioGroupItem
                      value={method.id}
                      id={method.id}
                      className="sr-only"
                    />
                    <Label
                      htmlFor={method.id}
                      className="flex h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 p-4 transition-all duration-200 hover:scale-105 hover:shadow-lg data-[state=checked]:border-primary data-[state=checked]:bg-primary/10 data-[state=checked]:shadow-xl"
                      data-state={
                        state.selectedMethod === method.id
                          ? "checked"
                          : "unchecked"
                      }
                    >
                      <div className="flex h-16 items-center justify-center">
                        <Image
                          src={method.logo}
                          alt={method.name}
                          width={80}
                          height={35}
                          className="h-12 object-contain"
                        />
                      </div>
                      <span className="text-xs font-medium text-muted-foreground">
                        {method.name}
                      </span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* --- Sección de Donación Bancaria --- */}
            <div className="mt-12 pt-12 border-t">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-primary">
                  Donaciones directas a nuestra cuenta Bancaria
                </h3>
                <p className="text-muted-foreground mt-2">
                  Haz tus donaciones a nombre de{" "}
                  <strong className="text-foreground">
                    Corporación Senderos de Esperanza
                  </strong>
                </p>
                <p className="font-mono text-sm text-muted-foreground mt-1">
                  NIT: 9002167381
                </p>
              </div>

              <div className="mt-8 flex items-center gap-6 rounded-xl border bg-muted/30 p-6 shadow-sm">
                <div className="flex-shrink-0">
                  <Image
                    src="https://logowik.com/content/uploads/images/banco-caja-social8452.logowik.com.webp" // 👈 Asegúrate de guardar el logo aquí
                    alt="Logo Banco Caja Social"
                    width={80}
                    height={80}
                    className="rounded-md object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <h4 className="font-semibold text-lg">Banco Caja Social</h4>
                  <p className="text-muted-foreground">
                    <strong>Cuenta Corriente:</strong> Nº 21004432101
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
