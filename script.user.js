// ==UserScript==
// @name         VI VON Script
// @namespace    https://github.com/ForsenPlace/Script
// @version      1
// @description  Script 
// @author       ForsenPlace
// @match        https://www.reddit.com/r/place/*
// @match        https://new.reddit.com/r/place/*
// @icon         https://cdn.frankerfacez.com/emoticon/545961/4
// @require	     https://cdn.jsdelivr.net/npm/toastify-js
// @resource     TOASTIFY_CSS https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css
// @updateURL    https://github.com/ForsenPlace/Script/raw/main/script.user.js
// @downloadURL  https://github.com/ForsenPlace/Script/main/script.user.js
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant GM.xmlHttpRequest
// @connect reddit.com
// ==/UserScript==

const TOAST_DURATION = 10 * 1000
const MAP_ERROR_RETRY_DELAY = 6 * 1000
const PARSE_ERROR_REFRESH_DELAY = 10 * 1000
const AFTER_PAINT_DELAY = 5.25 * 60 * 1000
const CHECK_AGAIN_DELAY = 30 * 1000
const REFRESH_TOKEN_DELAY = 30 * 60 * 1000

const COLOR_TO_INDEX = {
	'#6D001A': 0,
	'#BE0039': 1,
	'#FF4500': 2,
	'#FFA800': 3,
	'#FFD635': 4,
	'#FFF8B8': 5,
	'#00A368': 6,
	'#00CC78': 7,
	'#7EED56': 8,
	'#00756F': 9,
	'#009EAA': 10,
	'#00CCC0': 11,
	'#2450A4': 12,
	'#3690EA': 13,
	'#51E9F4': 14,
	'#493AC1': 15,
	'#6A5CFF': 16,
	'#94B3FF': 17,
	'#811E9F': 18,
	'#B44AC0': 19,
	'#E4ABFF': 20,
	'#DE107F': 21,
	'#FF3881': 22,
	'#FF99AA': 23,
	'#6D482F': 24,
	'#9C6926': 25,
	'#FFB470': 26,
	'#000000': 27,
	'#515252': 28,
	'#898D90': 29,
	'#D4D7D9': 30,
	'#FFFFFF': 31
};
const INDEX_TO_NAME = {
	'0': 'burgundy',
	'1': 'dark red',
	'2': 'red',
	'3': 'orange',
	'4': 'yellow',
	'5': 'pale yellow',
	'6': 'dark green',
	'7': 'green',
	'8': 'light green',
	'9': 'dark teal',
	'10': 'teal',
	'11': 'light teal',
	'12': 'dark blue',
	'13': 'blue',
	'14': 'light blue',
	'15': 'indigo',
	'16': 'periwinkle',
	'17': 'lavender',
	'18': 'dark purple',
	'19': 'purple',
	'20': 'pale purple',
	'21': 'magenta',
	'22': 'pink',
	'23': 'light pink',
	'24': 'dark brown',
	'25': 'brown', 
	'26': 'beige', 
	'27': 'black',
	'28': 'dark gray',
	'29': 'gray',
	'30': 'light gray',
	'31': 'white'
};

var currentOrdersByPrio = [];
var accessToken;
var canvas = document.createElement('canvas');

(async function () {
	GM_addStyle(GM_getResourceText('TOASTIFY_CSS'));
	canvas.width = 2000;
	canvas.height = 2000;
	canvas.style.display = 'none';
	canvas = document.body.appendChild(canvas);

	// Get the token
	Toastify({
		text: 'Obtaining access token...',
		duration: TOAST_DURATION
	}).showToast();
	accessToken = await getAccessToken();
	Toastify({
		text: 'Obtained access token!',
		duration: TOAST_DURATION
	}).showToast();

	// Start working
	currentOrdersByPrio = [[[771, 899, 27], [771, 900, 27], [771, 901, 27], [771, 902, 27], [771, 903, 27], [771, 904, 27], [771, 905, 27], [772, 899, 27], [772, 900, 4], [772, 901, 4], [772, 902, 27], [772, 903, 27], [772, 904, 27], [772, 905, 27], [773, 899, 27], [773, 900, 27], [773, 901, 4], [773, 902, 2], [773, 903, 2], [773, 904, 27], [773, 905, 27], [774, 899, 27], [774, 900, 27], [774, 901, 27], [774, 902, 27], [774, 903, 2], [774, 904, 2], [774, 905, 27], [775, 899, 27], [775, 900, 27], [775, 901, 4], [775, 902, 2], [775, 903, 2], [775, 904, 27], [775, 905, 27], [776, 899, 27], [776, 900, 4], [776, 901, 4], [776, 902, 27], [776, 903, 27], [776, 904, 27], [776, 905, 27], [777, 899, 27], [777, 900, 27], [777, 901, 27], [777, 902, 27], [777, 903, 27], [777, 904, 27], [777, 905, 27], [778, 899, 27], [778, 900, 4], [778, 901, 4], [778, 902, 2], [778, 903, 2], [778, 904, 2], [778, 905, 27], [779, 899, 27], [779, 900, 27], [779, 901, 27], [779, 902, 27], [779, 903, 27], [779, 904, 27], [779, 905, 27], [780, 899, 27], [780, 900, 4], [780, 901, 4], [780, 902, 27], [780, 903, 27], [780, 904, 27], [780, 905, 27], [781, 899, 27], [781, 900, 27], [781, 901, 4], [781, 902, 2], [781, 903, 2], [781, 904, 27], [781, 905, 27], [782, 899, 27], [782, 900, 27], [782, 901, 27], [782, 902, 27], [782, 903, 2], [782, 904, 2], [782, 905, 27], [783, 899, 27], [783, 900, 27], [783, 901, 4], [783, 902, 2], [783, 903, 2], [783, 904, 27], [783, 905, 27], [784, 899, 27], [784, 900, 4], [784, 901, 4], [784, 902, 27], [784, 903, 27], [784, 904, 27], [784, 905, 27], [785, 899, 27], [785, 900, 27], [785, 901, 27], [785, 902, 27], [785, 903, 27], [785, 904, 27], [785, 905, 27], [786, 899, 27], [786, 900, 4], [786, 901, 4], [786, 902, 2], [786, 903, 2], [786, 904, 2], [786, 905, 27], [787, 899, 27], [787, 900, 4], [787, 901, 27], [787, 902, 27], [787, 903, 27], [787, 904, 2], [787, 905, 27], [788, 899, 27], [788, 900, 4], [788, 901, 4], [788, 902, 2], [788, 903, 2], [788, 904, 2], [788, 905, 27], [789, 899, 27], [789, 900, 27], [789, 901, 27], [789, 902, 27], [789, 903, 27], [789, 904, 27], [789, 905, 27], [790, 899, 27], [790, 900, 4], [790, 901, 4], [790, 902, 2], [790, 903, 2], [790, 904, 2], [790, 905, 27], [791, 899, 27], [791, 900, 27], [791, 901, 4], [791, 902, 27], [791, 903, 27], [791, 904, 27], [791, 905, 27], [792, 899, 27], [792, 900, 27], [792, 901, 27], [792, 902, 2], [792, 903, 27], [792, 904, 27], [792, 905, 27], [793, 899, 27], [793, 900, 4], [793, 901, 4], [793, 902, 2], [793, 903, 2], [793, 904, 2], [793, 905, 27], [794, 899, 27], [794, 900, 27], [794, 901, 27], [794, 902, 27], [794, 903, 27], [794, 904, 27], [794, 905, 27], [795, 899, 27], [795, 900, 4], [795, 901, 27], [795, 902, 27], [795, 903, 2], [795, 904, 2], [795, 905, 27], [796, 899, 27], [796, 900, 4], [796, 901, 27], [796, 902, 2], [796, 903, 27], [796, 904, 2], [796, 905, 27], [797, 899, 27], [797, 900, 4], [797, 901, 4], [797, 902, 27], [797, 903, 27], [797, 904, 2], [797, 905, 27], [798, 899, 27], [798, 900, 27], [798, 901, 27], [798, 902, 27], [798, 903, 27], [798, 904, 27], [798, 905, 27], [799, 899, 27], [799, 900, 4], [799, 901, 4], [799, 902, 2], [799, 903, 2], [799, 904, 2], [799, 905, 27], [800, 899, 27], [800, 900, 27], [800, 901, 27], [800, 902, 27], [800, 903, 27], [800, 904, 2], [800, 905, 27], [801, 899, 27], [801, 900, 27], [801, 901, 27], [801, 902, 27], [801, 903, 27], [801, 904, 2], [801, 905, 27], [802, 899, 27], [802, 900, 4], [802, 901, 4], [802, 902, 2], [802, 903, 2], [802, 904, 2], [802, 905, 27], [803, 899, 27], [803, 900, 27], [803, 901, 27], [803, 902, 27], [803, 903, 27], [803, 904, 27], [803, 905, 27], [804, 899, 27], [804, 900, 4], [804, 901, 4], [804, 902, 2], [804, 903, 2], [804, 904, 2], [804, 905, 27], [805, 899, 27], [805, 900, 27], [805, 901, 27], [805, 902, 27], [805, 903, 27], [805, 904, 2], [805, 905, 27], [806, 899, 27], [806, 900, 27], [806, 901, 27], [806, 902, 27], [806, 903, 27], [806, 904, 2], [806, 905, 27], [807, 899, 27], [807, 900, 27], [807, 901, 27], [807, 902, 27], [807, 903, 27], [807, 904, 27], [807, 905, 27], [808, 899, 27], [808, 900, 4], [808, 901, 4], [808, 902, 2], [808, 903, 2], [808, 904, 2], [808, 905, 27], [809, 899, 27], [809, 900, 27], [809, 901, 27], [809, 902, 27], [809, 903, 27], [809, 904, 2], [809, 905, 27], [810, 899, 27], [810, 900, 27], [810, 901, 27], [810, 902, 27], [810, 903, 27], [810, 904, 2], [810, 905, 27], [811, 899, 27], [811, 900, 4], [811, 901, 4], [811, 902, 2], [811, 903, 2], [811, 904, 2], [811, 905, 27], [812, 899, 27], [812, 900, 27], [812, 901, 27], [812, 902, 27], [812, 903, 27], [812, 904, 27], [812, 905, 27], [813, 899, 27], [813, 900, 4], [813, 901, 4], [813, 902, 2], [813, 903, 2], [813, 904, 2], [813, 905, 27], [814, 899, 27], [814, 900, 27], [814, 901, 27], [814, 902, 27], [814, 903, 27], [814, 904, 2], [814, 905, 27], [815, 899, 27], [815, 900, 27], [815, 901, 27], [815, 902, 27], [815, 903, 27], [815, 904, 2], [815, 905, 27], [816, 899, 27], [816, 900, 27], [816, 901, 27], [816, 902, 27], [816, 903, 27], [816, 904, 27], [816, 905, 27]], [], [], [], []]
	executeOrders();


	// Periodically refresh the token
	setInterval(async () => {
		Toastify({
			text: 'Refreshing access token...',
			duration: TOAST_DURATION
		}).showToast();
        accessToken = await getAccessToken();
		Toastify({
			text: 'Refreshed access token!',
			duration: TOAST_DURATION
		}).showToast();
    }, REFRESH_TOKEN_DELAY)
})();

async function getAccessToken() {
	const usingOldReddit = window.location.href.includes('new.reddit.com');
    const url = usingOldReddit ? 'https://new.reddit.com/r/place/' : 'https://www.reddit.com/r/place/';
    const response = await fetch(url);
    const responseText = await response.text();

	return responseText.split('\"accessToken\":\"')[1].split('"')[0];
}

async function executeOrders() {
	var ctx;
	try {
		ctx = await getCanvasFromUrl(await getCurrentImageUrl('0'), 0, 0);
		ctx = await getCanvasFromUrl(await getCurrentImageUrl('1'), 1000, 0);
		ctx = await getCanvasFromUrl(await getCurrentImageUrl('2'), 0, 1000);
		ctx = await getCanvasFromUrl(await getCurrentImageUrl('3'), 1000, 1000);
	} catch (e) {
		console.warn('Error obtaining map', e);
		Toastify({
			text: `Couldn\'t get map. Trying again in ${MAP_ERROR_RETRY_DELAY / 1000} seconds...`,
			duration: MAP_ERROR_RETRY_DELAY
		}).showToast();
		setTimeout(executeOrders, MAP_ERROR_RETRY_DELAY);
		return;
	}

	for (const [prioIndex, orders] of currentOrdersByPrio.entries()) {
		let start = Math.floor(Math.random() * orders.length);
		for (let offset = 0; offset < orders.length; offset++) {
			const order = orders[(start + offset) % orders.length]
			const x = order[0];
			const y = order[1];
			const colorId = order[2];
			const rgbaAtLocation = ctx.getImageData(x, y, 1, 1).data;
			const hex = rgbToHex(rgbaAtLocation[0], rgbaAtLocation[1], rgbaAtLocation[2]);
			const currentColorId = COLOR_TO_INDEX[hex];
	
			// If the pixel color is already correct skip
			if (currentColorId == colorId) continue;
	
			Toastify({
				text: `Changing pixel on ${x}, ${y} with priority ${prioIndex + 1} from ${INDEX_TO_NAME[currentColorId]} to ${INDEX_TO_NAME[colorId]}`,
				duration: TOAST_DURATION
			}).showToast();
			const res = await place(x, y, colorId);
			const data = await res.json();
	
			try {
				if (data.errors) {
					const error = data.errors[0];
					const nextPixel = error.extensions.nextAvailablePixelTs + 3000;
					const nextPixelDate = new Date(nextPixel);
					const delay = nextPixelDate.getTime() - Date.now();
					Toastify({
						text : `Too early to place pixel! Next pixel at ${ nextPixelDate.toLocaleTimeString()}`,
						duration: delay
					}).showToast();
					setTimeout(executeOrders, delay);
				} else {
					const nextPixel = data.data.act.data[0].data.nextAvailablePixelTimestamp + 3000;
					const nextPixelDate = new Date(nextPixel);
					const delay = nextPixelDate.getTime() - Date.now();
					Toastify({
						text : `Pixel placed on ${x}, ${y}! Next pixel at ${nextPixelDate.toLocaleTimeString()}`,
						duration: delay
					}).showToast();
					setTimeout(executeOrders, delay);
				}
			} catch (e) {
				// The token probably expired, refresh and hope for the best
				console.warn ('Error parsing response', e);
				Toastify({
					text : `Error parsing response after placing pixel. Refreshing the page in ${PARSE_ERROR_REFRESH_DELAY / 1000} seconds...`,
					duration: PARSE_ERROR_REFRESH_DELAY
				}).showToast();
				setTimeout(() => {
					window.location.reload();
				}, PARSE_ERROR_REFRESH_DELAY);
			}
	
			return;
		}
	}

	Toastify({
		text: `Every pixel is correct! checking again in ${CHECK_AGAIN_DELAY / 1000} seconds...`,
		duration: CHECK_AGAIN_DELAY
	}).showToast();
	setTimeout(executeOrders, CHECK_AGAIN_DELAY);
}

function place(x, y, color) {
	return fetch('https://gql-realtime-2.reddit.com/query', {
		method: 'POST',
		body: JSON.stringify({
			'operationName': 'setPixel',
			'variables': {
				'input': {
					'actionName': 'r/replace:set_pixel',
					'PixelMessageData': {
						'coordinate': {
							'x': x % 1000,
							'y': y % 1000
						},
						'colorIndex': color,
						'canvasIndex': getCanvasIndex(x, y)
					}
				}
			},
			'query': 'mutation setPixel($input: ActInput!) { act(input: $input) { data { ... on BasicMessage { id data { ... on GetUserCooldownResponseMessageData { nextAvailablePixelTimestamp __typename } ... on SetPixelResponseMessageData { timestamp __typename } __typename } __typename } __typename } __typename } }'
		}),
		headers: {
			'origin': 'https://hot-potato.reddit.com',
			'referer': 'https://hot-potato.reddit.com/',
			'apollographql-client-name': 'mona-lisa',
			'Authorization': `Bearer ${accessToken}`,
			'Content-Type': 'application/json'
		}
	});
}

function getCanvasIndex(x, y) {
    if (x <= 999) {
        return y <= 999 ? 0 : 2;
    } else {
        return y <= 999 ? 1 : 3;
    }
}

async function getCurrentImageUrl(tag) {
	return new Promise((resolve, reject) => {
		const ws = new WebSocket('wss://gql-realtime-2.reddit.com/query', 'graphql-ws');

		ws.onopen = () => {
			ws.send(JSON.stringify({
				'type': 'connection_init',
				'payload': {
					'Authorization': `Bearer ${accessToken}`
				}
			}));
			ws.send(JSON.stringify({
				'id': '1',
				'type': 'start',
				'payload': {
					'variables': {
						'input': {
							'channel': {
								'teamOwner': 'AFD2022',
								'category': 'CANVAS',
								'tag': tag
							}
						}
					},
					'extensions': {},
					'operationName': 'replace',
					'query': 'subscription replace($input: SubscribeInput!) { subscribe(input: $input) { id ... on BasicMessage { data { __typename ... on FullFrameMessageData { __typename name timestamp } } __typename } __typename } }'
				}
			}));
		};

		ws.onmessage = (message) => {
			const { data } = message;
			const parsed = JSON.parse(data);

			if (!parsed.payload || !parsed.payload.data || !parsed.payload.data.subscribe || !parsed.payload.data.subscribe.data) return;

			ws.close();
			resolve(parsed.payload.data.subscribe.data.name + `?noCache=${Date.now() * Math.random()}`);
		}

		ws.onerror = reject;
	});
}

function getCanvasFromUrl(url, x, y) {
	return new Promise((resolve, reject) => {
		var ctx = canvas.getContext('2d');
		GM.xmlHttpRequest({
			method: "GET",
			url: url,
			responseType: 'blob',
			onload: function(response) {
				var urlCreator = window.URL || window.webkitURL;
				var imageUrl = urlCreator.createObjectURL(this.response);
				var img = new Image();
				img.onload = () => {
					ctx.drawImage(img, x, y);
					resolve(ctx);
				};
			img.src = imageUrl;
			}
		});
	});
}

function rgbToHex(r, g, b) {
	return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}
