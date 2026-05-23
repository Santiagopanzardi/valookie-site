import Pocketbase from 'pocketbase';

const POCKETBASE_API_URL = import.meta.env.VITE_POCKETBASE_URL || "https://horizons.hostinger.com/20aebe59-367d-486d-b6c5-8fc8284b40e6/hcgi/platform";

const pocketbaseClient = new Pocketbase(POCKETBASE_API_URL);

export default pocketbaseClient;

export { pocketbaseClient };
