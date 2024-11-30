import { Inject, Injectable } from "@angular/core";
import exp from "constants";

@Injectable({providedIn:'root'})
export class ApplicationConstants {
    private readonly BACKEND_PORT = 8080;
    private readonly VERSION = `v1`;
    private readonly HOST= 'https://rfm-backend.onrender.com'
    // private readonly HOST= 'http://localhost:8080'

    getBackendPort(): number {
        return this.BACKEND_PORT;
    }

    getVersion() : string {
        return this.VERSION;
    }

    getHost(): string {
      return this.HOST;
    }
}
