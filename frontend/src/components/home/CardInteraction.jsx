import { useState } from "react";
import CardNumberInput from "./CardNumberInput";
import axios from "axios";

import "../../styles/Home.css";
import ElectronicTerminal from "./ElectronicTerminal";
import CreditCard from "./CreditCard";
import {
  separateCardNumber,
  hideCardNumber,
} from "../../services/formatCardNumbers";

const DEMO_CARDS = [
  {
    name: "John Doe",
    number: "1111222233334444",
  },
  {
    name: "Jane Smith",
    number: "9999888877776666",
  },
];

export default function CardInteraction() {
  const [inputCardNumbers, setInputCardNumbers] = useState("");
  const [cardNumbers, setCardNumbers] = useState("**** **** **** ****");
  const [isCardInserted, setIsCardInserted] = useState(false);
  const [isCardValidated, setIsCardValidated] = useState(false);
  const [message, setMessage] = useState("Veuillez insérer votre carte");

  function handleSelectDemoCard(number) {
    setInputCardNumbers(number);
    setMessage("Veuillez insérer votre carte");
    setIsCardValidated(false);

    let cardIdValue = "";
    number.split("").forEach((n, i) => {
      cardIdValue += separateCardNumber(i, 4) + hideCardNumber(i, n, 12);
    });
    setCardNumbers(cardIdValue);
  }

  function handleCardVerification(number) {
    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/cards/verify`, {
        cardNumber: number,
      })
      .then((res) => {
        if (res.status === 200) {
          setIsCardInserted((old) => !old);
          setIsCardValidated(true);
          setMessage("Entrez le code PIN");
        }
      })
      .catch(() => {
        setIsCardInserted((old) => !old);
        setMessage(
          "Cette carte n'est associé à aucun compte. Veuillez vérifier le numero de votre carte."
        );
      });
  }

  /**
   * The function `handleCardInserted` checks if a valid card number has been entered and if it is
   * associated with a user account.
   */
  function handleCardInserted() {
    setIsCardInserted(!isCardInserted);
    setIsCardValidated(false);
    setTimeout(() => {
      // vérifier le nombre de chiffre
      if (inputCardNumbers.length !== 16) {
        setIsCardInserted((old) => !old);
        setMessage("Le numéro de la carte doit contenir 16 chiffres.");
        return;
      }

      handleCardVerification(inputCardNumbers);
    }, "2000");
  }

  return (
    <section className="flex flex-col items-center gap-4">
      {/* Panneau Démo */}
      <div className="flex flex-col items-center gap-2 rounded-2xl bg-primary p-4 shadow-neo text-secondary">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span>💡 Comptes de démonstration</span>
          <span className="rounded-full bg-screen px-2.5 py-0.5 text-xs font-bold text-secondary shadow-neo_inset">
            Code PIN : 1234
          </span>
        </div>
        <div className="flex flex-wrap justify-center gap-3 pt-1">
          {DEMO_CARDS.map((card) => (
            <button
              key={card.number}
              type="button"
              onClick={() => handleSelectDemoCard(card.number)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                inputCardNumbers === card.number
                  ? "shadow-neo_inset text-green-700 font-bold"
                  : "shadow-neo hover:shadow-neo_inset active:shadow-neo_inset"
              }`}
            >
              💳 {card.name} : {card.number.replace(/(\d{4})/g, "$1 ").trim()}
            </button>
          ))}
        </div>
      </div>

      <CardNumberInput
        inputCardNumbers={inputCardNumbers}
        setInputCardNumbers={setInputCardNumbers}
        setCardNumbers={setCardNumbers}
        handleCardInserted={handleCardInserted}
        setIsCardValidated={setIsCardValidated}
        setMessage={setMessage}
      />

      <section className="flex h-full w-full items-center justify-center gap-8 p-4">
        <ElectronicTerminal
          message={message}
          setMessage={setMessage}
          isCardValidated={isCardValidated}
          inputCardNumbers={inputCardNumbers}
        />
        <CreditCard
          isCardInserted={isCardInserted}
          cardNumbers={cardNumbers}
          handleCardInserted={handleCardInserted}
        />
      </section>
    </section>
  );
}
