import Axios from "axios";

var xpath = require('xpath')
    , dom = require('xmldom').DOMParser

import { Parameter } from "coli/lib"

const axios = Axios.create(
    {
        baseURL: "https://api.flutter.dev/"
    }
)