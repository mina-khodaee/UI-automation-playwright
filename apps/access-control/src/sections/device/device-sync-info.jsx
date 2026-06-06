import { useEffect, useState } from 'react';
import signalRConnection, { endpoints } from '@repo/ui/utils';

// ----------------------------------------------------------------------

export function DeviceSyncInfo({ onGet }) {
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
      signalRConnection.on("DeviceSyncInfo", (result) => {
        console.log('sync info', result);
        onGet(result);

      });
    }
  }, [connection, onGet]);
}

