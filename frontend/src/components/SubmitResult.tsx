import { UIEvent } from "../types";
import * as react from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { Button } from "./Button";

interface Props {
  events: UIEvent[];
  errorMessage: string;
}

export const SubmitResult = ({ events, errorMessage }: Props) => {
  const [submitOutcome, setSubmitOutcome] = useState("");
  useEffect(() => {
    events.forEach((e) => {
      if (e.name === "system:ExtrinsicFailed") {
        setSubmitOutcome(
          "The transaction was not successful. Try again."
        );
      }
    });
  }, [events]);

  return (
    <>
      <div className="submit-outcome">
        <div className="mb-3">{submitOutcome}</div>

      </div>

      <react.Disclosure>
        {({ open }) => (
          <>
            <react.Disclosure.Button className="disclosure-button">
              <span>Events log</span>
              <ChevronUpIcon
                className={`${
                  open ? "rotate-180 transform" : ""
                } h-5 w-5 text-purple-500`}
              />
            </react.Disclosure.Button>
            <react.Disclosure.Panel className="disclosure-panel">
              {events.map((ev: UIEvent, index: number) => {
                return (
                  <div key={`${ev.name}-${index}`} className="ui-event">
                    <div className="ui-event-name">{ev.name}</div>
                    <div className="ui-event-message">{ev.message}</div>
                  </div>
                );
              })}
            </react.Disclosure.Panel>
          </>
        )}
      </react.Disclosure>

      {errorMessage && (
        <react.Disclosure>
          {({ open }) => (
            <>
              <react.Disclosure.Button className="disclosure-button">
                <span>Error log</span>
                <ChevronUpIcon
                  className={`${
                    open ? "rotate-180 transform" : ""
                  } h-5 w-5 text-purple-500`}
                />
              </react.Disclosure.Button>
              <react.Disclosure.Panel className="disclosure-panel">
                {errorMessage}
              </react.Disclosure.Panel>
            </>
          )}
        </react.Disclosure>
      )}
      <div>
        <Button onClick={() => window.location.reload()}>
          Continue Learning
        </Button>
      </div>
    </>
  );
};
