import { getToken } from 'utils';
const token = getToken();

export function getData() {
    console.log(token);
}