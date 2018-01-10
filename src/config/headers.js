import cookie from 'react-cookie';

/**
 * 通用头信息.
 */
export function headers(key, value) {
	let result = {
		'credentials':'include',
		'Content-Type': 'application/json',
	};
	key && (result[key] = value);
	return result;
}
