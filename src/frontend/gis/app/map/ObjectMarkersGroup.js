"use client"
import React, {useEffect, useState} from 'react';
import {LayerGroup, useMap} from 'react-leaflet';
import {ObjectMarker} from "./ObjectMarker";

const DEMO_DATA = [
    {
        "type": "feature",
        "geometry": {
            "type": "Point",
            "coordinates": [41.69462, -8.84679]
        },
        "properties": {
            id: "7674fe6a-6c8d-47b3-9a1f-18637771e23b",
            name: "Ronaldo",
            country: "Portugal",
            position: "Striker",
            imgUrl: "https://cdn-icons-png.flaticon.com/512/805/805401.png",
            number: 7
        }
    },

    {
        "type": "feature",
        "geometry": {
            "type": "Point",
            "coordinates": [41.69662, -8.84979]
        },
        "properties": {
            id: "36ee2d0f-a918-472a-8e2e-ad5f567cdb89",
            name: "Messi",
            country: "Argentina",
            position: "Forward",
            imgUrl: "https://cdn-icons-png.flaticon.com/512/805/805404.png",
            number: 10
        }
    },

    {
        "type": "feature",
        "geometry": {
            "type": "Point",
            "coordinates": [41.69562, -8.84979]
        },
        "properties": {
            id: "4cb5b2f0-343d-4250-ba5c-3a235343cb01",
            name: "Ibrahimovic",
            country: "Sweden",
            position: "Striker",
            imgUrl: "https://cdn-icons-png.flaticon.com/512/805/805409.png",
            number: 11
        }
    }
];

function ObjectMarkersGroup() {
    const map = useMap();
    const [geom, setGeom] = useState([...DEMO_DATA]);
    const [bounds, setBounds] = useState(map.getBounds());

    useEffect(() => {
        const cb = () => {
            setBounds(map.getBounds());
        }
        map.on('moveend', cb);

        return () => {
            map.off('moveend', cb);
        }
    }, []);

    useEffect(() => {
        setGeom([]);
        console.log(`> getting data for bounds`, bounds);

        const apiUrl = `http://localhost:20002/api/tile?neLat=${bounds._northEast.lat}&neLng=${bounds._northEast.lng}&swLat=${bounds._southWest.lat}&swLng=${bounds._southWest.lng}`;
        
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                console.log(`> fetched data from`, apiUrl);
                if (data.result && data.result.length > 0) {
                    console.log(`> data`, data.result);

                    setGeom(data.result);
                } 
            })
            .catch(error => {
                console.error(`> error getting data`, error);
            });
    }, [bounds])

    return (
        <LayerGroup>
            {
                geom.map(geoJSON => <ObjectMarker key={geoJSON.properties.id} geoJSON={geoJSON}/>)
            }
        </LayerGroup>
    );
}

export default ObjectMarkersGroup;
