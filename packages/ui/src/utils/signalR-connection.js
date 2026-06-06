import { HubConnectionBuilder } from '@microsoft/signalr';

class SignalRConnection {
  static instance;

  #connection = null;

  #config = null;

  constructor() {
    if (!SignalRConnection.instance) {
      SignalRConnection.instance = this;
    }
  }

  /**
   * Initialize SignalR connection with app config.
   * Call this once during app initialization before using connect().
   * @param {Object} config - App configuration containing signalRUrl
   * @example
   * import signalRConnection from '@repo/ui/signalR';
   * import { CONFIG } from './global-config';
   * 
   * signalRConnection.initialize(CONFIG);
   */
  initialize(config) {
    this.#config = config;
  }

  connect(url) {
    if (!this.#connection) {
      if (!this.#config?.signalRUrl) {
        console.error('SignalRConnection: Not initialized. Call initialize(config) first.');
        return null;
      }
      this.#connection = new HubConnectionBuilder()
        .withUrl(`${this.#config.signalRUrl}${url}`)
        .build();

      this.#connection.start()
        .then(() => console.log('Connected to SignalR Hub'))
        .catch(err => console.error(`Error while starting connection: ${err}`));
    }
    return this.#connection;
  }

  disconnect() {
    if (this.#connection) {
      this.#connection.stop();
      console.log('Disconnected from SignalR Hub');
      this.#connection = null;
    }
  }

  on(event, callback) {
    if (this.#connection) {
      this.#connection.on(event, callback);
    }
  }

  off(event) {
    if (this.#connection) {
      this.#connection.off(event);
    }
  }
}

const signalRConnection = new SignalRConnection();
export default signalRConnection;

export const endpoints = {
  deviceHub: '/devicehub',
};
