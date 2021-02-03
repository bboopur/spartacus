import { AbstractType, Injectable } from '@angular/core';
import { Config, CxEvent, WindowRef } from '@spartacus/core';

/**
 * Collector configuration
 */
export interface TmsCollectorConfig {
  /**
   * Pushes the event to the configured data layer.
   */
  dataLayerPush?: <T extends CxEvent>(event: T, winRef: WindowRef) => void;
  /** Should be enabled in development mode only */
  debug?: boolean;
  /**
   * Events to send to the configured TMS.
   */
  events?: AbstractType<CxEvent>[];
}

/**
 * TMS configuration
 */
@Injectable({
  providedIn: 'root',
  useExisting: Config,
})
export abstract class TmsConfig {
  tms?: {
    [tms: string]: TmsCollectorConfig;
  };
}
