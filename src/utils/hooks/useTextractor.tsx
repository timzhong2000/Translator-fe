import { useEffect, useState } from "react";
import { TextractorSubscriber } from "../textractor/TextractorClient";

const useTextractor = (url: string) => {
  const [text, setText] = useState("");
  const [error, setError] = useState();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    setOk(false);
    setError(undefined);
    let temp: TextractorSubscriber | undefined;
    TextractorSubscriber.create(url)
      .then((subscriber) => {
        temp = subscriber;
        setOk(true);
        subscriber.subscribe((text) => setText(text));
      })
      .catch((err) => {
        setError(err);
      });
    return () => temp && temp.destroy();
  }, [url]);

  return { text, ok, error };
};

export default useTextractor;
