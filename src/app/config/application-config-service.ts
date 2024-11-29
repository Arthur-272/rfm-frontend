import { Injectable } from "@angular/core";
import {ApplicationConstants} from '../config/constants'

@Injectable({
    providedIn: 'root'
})
export class ApplicationConfigService {

    resourceURL: string;


    constructor(private constants : ApplicationConstants) {
        this.resourceURL = `${constants.getHost()}:${constants.getBackendPort()}/api/${constants.getVersion()}`;
    }

    getResourceURL() :string {
        return this.resourceURL;
    }
}
