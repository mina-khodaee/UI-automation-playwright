import { useEffect, useState } from 'react';
import signalRConnection, { endpoints } from '@repo/ui/utils';

// ----------------------------------------------------------------------

export function OnlineDeviceList({ onGet }) {
  const [connection, setConnection] = useState(null);
  useEffect(() => {
    const conn = signalRConnection.connect(endpoints.deviceHub);
    setConnection(conn);

    return () => {
      signalRConnection.disconnect(); 
    };
  }, []); 

  useEffect(() => {
    console.log('connection', connection);
    if (connection) {
      signalRConnection.on("OnlineTerminals", (result) => {
        console.log('Online terminals:', result);
        onGet(result);

      });
    }
  }, [connection, onGet]);
}

