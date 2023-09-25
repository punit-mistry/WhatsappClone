import React, { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";

const TerminalComponent = () => {
  const terminalRef = useRef(null);

  useEffect(() => {
    const terminal = new Terminal();
    const fitAddon = new FitAddon();

    terminal.loadAddon(fitAddon);
    terminal.open(terminalRef.current);
    terminal.write("Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ");
    fitAddon.fit();

    // You can customize the terminal further, add event listeners, and execute commands here.

    return () => {
      // Clean up the terminal when the component unmounts
      terminal.dispose();
    };
  }, []);

  return <div ref={terminalRef}></div>;
};

export default TerminalComponent;
