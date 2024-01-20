"use client"
import React from "react";
import {Marker, Popup} from 'react-leaflet';
import {icon as leafletIcon, point} from "leaflet";

import {Avatar, List, ListItem, ListItemIcon, ListItemText} from "@mui/material";
import {Cake, Flag, Height, FitnessCenter, SportsBasketball} from "@mui/icons-material";


const LIST_PROPERTIES = [
    {"key": "age", label: "Age", Icon: Cake},
    {"key": "country", label: "Country", Icon: Flag},
    {"key": "height", label: "Height", Icon: Height},
    {"key": "weight", label: "Weight", Icon: FitnessCenter},
    {"key": "draft_year", label: "Draft Year", Icon: SportsBasketball}
];

export function ObjectMarker({geoJSON}) {
    const properties = geoJSON?.properties;
    const imgUrl = "https://cdn-icons-png.flaticon.com/512/805/805401.png";
    const {id, name} = properties;
    const coordinates = geoJSON?.geometry?.coordinates;

    return (
        <Marker
            position={coordinates}
            icon={leafletIcon({
                iconUrl: imgUrl,
                iconRetinaUrl: imgUrl,
                iconSize: point(50, 50),
            })}
        >
            <Popup>
                <List dense={true}>
                    <ListItem>
                        <ListItemIcon>
                            <Avatar alt={name} src={imgUrl}/>
                        </ListItemIcon>
                        <ListItemText primary={name}/>
                    </ListItem>
                    {
                        LIST_PROPERTIES
                            .map(({key, label, Icon}) =>
                                <ListItem key={key}>
                                    <ListItemIcon>
                                        <Icon style={{color: "black"}}/>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={<span>
                                        {properties[key]}<br/>
                                        <label style={{fontSize: "xx-small"}}>({label})</label>
                                    </span>}
                                    />
                                </ListItem>
                            )
                    }

                </List>

            </Popup>
        </Marker>
    )
}