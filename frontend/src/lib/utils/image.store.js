import { writable } from 'svelte/store';

export const image = writable(null);
export const loading = writable(false);
export const places = writable([]);