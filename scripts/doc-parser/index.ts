import Axios from "axios";

var xpath = require('xpath')
    , dom = require('xmldom').DOMParser


const axios = Axios.create(
    {
        baseURL: "https://api.flutter.dev/"
    }
)