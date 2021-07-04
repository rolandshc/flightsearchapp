const { Database, aql } = require("arangojs");
// Const variables for connecting to ArangoDB database
const host = 'arangodb_container';
const port = '8529';
const username = 'root';
const password = 'Testing123';
const databasename = '_system';
const request = require('request');

// Connection to ArangoDB
const db = new Database({
	url: `http://${host}:${port}`,
	databaseName: databasename,
	auth: { username: username, password: password }
});
db.useBasicAuth(username, password);

const Flights = db.collection("flights");


module.exports = {
	getShortestPath: async function (airportFrom, airportTo) {
		try {
			var shortestPath;
			const path = await db.query(aql`
			RETURN LENGTH(FOR v IN OUTBOUND SHORTEST_PATH ${airportFrom} TO ${airportTo} flights RETURN v)`);
			await path.forEach(element => {
				shortestPath = element - 1
			});
			return await shortestPath
		} catch (err) {
			console.error("DB error =" + err.message);
		}
	},
	getAirports: async function () {
		try {
			const Airports = await db.query(aql`
			FOR f IN flights
			RETURN DISTINCT f._from`);
			const list = [];
			await Airports.forEach(element => {
				list.push(element);
			});
			return await list;
		} catch (err) {
			console.error(err.message);
		}
	},
	getFastestPathByDate: async function (airportFrom, airportTo, _day, _month, _year) {
		try {
			var shortestPath;
			const path = await db.query(aql`
			RETURN LENGTH(FOR v IN OUTBOUND SHORTEST_PATH ${airportFrom} TO ${airportTo} flights RETURN v)`);
			await path.forEach(element => { shortestPath = element - 1 });
			console.log("Shortest Path = " + shortestPath)
			switch (shortestPath) {
				case 1:
					const data = await db.query(aql`FOR v, e, p IN ${shortestPath} OUTBOUND ${airportFrom} flights
					FILTER v._id == ${airportTo}
					FILTER p.edges[0].Year ==${_year}
					FILTER p.edges[0].Month ==${_month}
					FILTER p.edges[0].Day ==${_day}
					LET flightTime = DATE_DIFF(p.edges[0].DepTimeUTC, p.edges[0].ArrTimeUTC, 'i')
					SORT flightTime ASC
					LIMIT 20
					RETURN { flight: p, time: flightTime }`).then((cursor) => { return cursor.all() });;
					return await data;
				case 2:
					return await db.query(aql`FOR v, e, p IN ${shortestPath} OUTBOUND ${airportFrom} flights
					FILTER v._id == ${airportTo}
					FILTER p.edges[0].Year == ${_year}
					FILTER p.edges[0].Month == ${_month}
					FILTER p.edges[0].Day == ${_day}
					FILTER DATE_ADD(p.edges[0].ArrTimeUTC, 20, 'minutes') < p.edges[1].DepTimeUTC
					LET flightTime = DATE_DIFF(p.edges[0].DepTimeUTC, p.edges[1].ArrTimeUTC, 'i')
					SORT flightTime ASC
					LIMIT 20
					RETURN { flight: p, time: flightTime }`).then((cursor) => { return cursor.all() });;
				default:
					return await { "error": "No path available." };
			}
		}
		catch (err) {
			console.error("DB error =" + err.message);
		}
	},

	getDelay: async function () {
		try {
			const delayRequest = {
				url: 'https://soa.smext.faa.gov/asws/api/airport/delays',
				method: 'GET',
				json: {},
				qs: {}
			};
			const requesetResponse = await request(delayRequest, (err, response, body) => {
				if (err) {
					console.log("delay err = " + err);
					return { "error": err };
				} else if (response.statusCode === 200) {
					if (body.GroundDelays) {
						console.log("delay body = " + JSON.stringify(response));
						return body
					}
				} else {
					console.log(response.statusCode);
					return { "errorCode": response.statusCode };
				}

			});
			return await requesetResponse;
		}
		catch (err) {
			console.error("delay API error =" + err.message);
		}
	}

}




