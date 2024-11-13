import { useEffect } from "react";
import { queryClient, useApp } from "./ThemeApp";
import useWebSocket, { ReadyState } from "react-use-websocket";

const AppSocket = () => {
  const { auth } = useApp();

  // readyState have the state Of WS connection (opening or opened or closing or closed etc... states)
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    import.meta.env.VITE_WS_API
  );

  //sent to WS
  useEffect(() => {
    if (auth && readyState === ReadyState.OPEN) {
      sendJsonMessage({
        token: localStorage.getItem("token"),
      });
      console.log("WS: Connection ready and Token sent");
    }
  }, [readyState, auth]);

  //sent from WS
  useEffect(() => {
    console.log("WS: New message received");
    if (lastJsonMessage && lastJsonMessage.event) {
      queryClient.invalidateQueries(lastJsonMessage.event);
    }
  }, [lastJsonMessage]);

  return <></>;
};

export default AppSocket;
