import { useState, useEffect } from "react";
import { GetInternalIP, SetInternalIP } from "../../wailsjs/go/main/App";
import { EventsOn } from "../../wailsjs/runtime/runtime";
interface PingResult {
  time: string;
  internalIP: string;
  success: boolean;
  output: string;
}
function PingComponent() {
  const [pingResults, setPingResults] = useState<PingResult[]>([
    {
      time: "00:00:00",
      internalIP: "",
      success: true,
      output: "",
    },
  ]);
  const [editIP, setEditIP] = useState(false);
  const [ip, setIP] = useState(
    localStorage.getItem("pingomat-ip") || "192.168.178.1"
  );

  function validateIpRegex(ip: string) {
    const regex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    return regex.test(ip);
  }

  function onClickIpChange() {
    if (editIP) {
      const ipPass = validateIpRegex(ip);

      if (ipPass) {
        localStorage.setItem("pingomat-ip", ip);
        SetInternalIP(ip);
      }

      console.log("CLOSE");
      setEditIP(false);
    } else {
      setEditIP(true);
    }
  }

  useEffect(() => {
    SetInternalIP(ip);

    EventsOn("pingResult", (result: PingResult) => {
      console.log("result", result);
      console.log("internal registered IP", GetInternalIP());
      setPingResults((data) => {
        const newData = [result, ...data];
        if (newData.length > 1000) {
          newData.pop();
        }
        return newData;
      });
    });
  }, []);

  return (
    <div className="container mx-auto flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Ping Results</h1>
      <div
        id="ping-results"
        className={`text-2xl font-semibold ${
          pingResults[0].success ? "text-green-500" : "text-red-500"
        }`}
      >
        {pingResults[0].success ? "OK: Success" : "!! Error"}
      </div>
      <div id="ping-ip-container" className="flex justify-center gap-2">
        <input
          id="ping-ip-field"
          className="items-center rounded-xl py-2 text-center text-black disabled:bg-gray-500"
          disabled={!editIP}
          onChange={(e) => setIP(e.target.value)}
          value={ip}
        />
        <button
          id="change-ip-button"
          className="items-center rounded-xl border border-black bg-white p-2 text-center text-black"
          onClick={onClickIpChange}
        >
          Change IP
        </button>
      </div>
      <div className="flex justify-center">
        <div
          id="ping-output"
          className="h-[20rem] min-h-[20rem] w-[30rem] min-w-[30rem] overflow-y-scroll rounded-xl border border-black bg-white p-2 text-xs text-black"
        >
          {pingResults.map((result, index) => {
            return (
              <div key={index} className="mb-3">
                <div className="mb-2 flex items-center justify-center gap-3">
                  <p className="font-bold">{result.time}</p>
                  <p>-</p>
                  <p>{result.internalIP}</p>
                  <p>-</p>
                  <p className="font-bold">
                    {result.success ? "Success" : "Error"}
                  </p>
                </div>
                <pre className="text-xs font-thin">{result.output}</pre>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export { PingComponent };
