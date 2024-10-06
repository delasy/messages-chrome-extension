import React from "react";
import Header from "./Header";
import Messages from "./Messages";
import Providers from "./Providers";
import Surface from "./Surface";

function App() {
  return (
    <Providers>
      <Surface>
        <div className="flex flex-col gap-2 w-full h-full px-2 pt-2">
          <Header />
          <Messages />
        </div>
      </Surface>
    </Providers>
  );
}

export default App;
