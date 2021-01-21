import { Component, Input } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  I18nTestingModule,
  PointOfService,
  RoutingService,
} from '@spartacus/core';
import { StoreFinderStoreComponent } from './store-finder-store.component';
import { ICON_TYPE, SpinnerModule } from '@spartacus/storefront';
import { BehaviorSubject, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { StoreFinderService } from '@spartacus/storefinder/core';

const isLoading$: BehaviorSubject<Boolean> = new BehaviorSubject(true);
const isLoaded$: BehaviorSubject<Boolean> = new BehaviorSubject(true);
class MockStoreFinderService {
  getStoresLoading = () => isLoading$.asObservable();
  getStoresLoaded = () => isLoaded$.asObservable();
  getFindStoresEntities() {
    return of();
  }
  viewStoreById() {
    return of();
  }
}

@Component({
  selector: 'cx-icon',
  template: '',
})
class MockCxIconComponent {
  @Input() type: ICON_TYPE;
}

@Component({
  selector: 'cx-store-finder-store-description',
  template: '',
})
class MockStoreFinderStoreDescriptionComponent {
  @Input() location: PointOfService;
  @Input() disableMap: boolean;
}

const mockActivatedRoute = {
  snapshot: {
    params: {
      store: 'test-store',
      country: 'test',
    },
  },
};

describe('StoreFinderStoreComponent', () => {
  let component: StoreFinderStoreComponent;
  let fixture: ComponentFixture<StoreFinderStoreComponent>;
  let routingService: RoutingService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SpinnerModule, RouterTestingModule, I18nTestingModule],
        declarations: [
          StoreFinderStoreComponent,
          MockStoreFinderStoreDescriptionComponent,
          MockCxIconComponent,
        ],
        providers: [
          { provide: RoutingService, useValue: { go: jasmine.createSpy() } },
          {
            provide: StoreFinderService,
            useClass: MockStoreFinderService,
          },
          {
            provide: ActivatedRoute,
            useValue: mockActivatedRoute,
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    routingService = TestBed.inject(RoutingService);
    fixture = TestBed.createComponent(StoreFinderStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call goBack and return to previous view', () => {
    component.goBack();

    expect(routingService.go).toHaveBeenCalledWith([
      `store-finder/country/${mockActivatedRoute.snapshot.params.country}`,
    ]);
  });

  it('should call findStores on language change', () => {
    spyOn(component, 'requestStoresData');
    isLoading$.next(false);
    isLoaded$.next(false);
    fixture.detectChanges();

    expect(component.requestStoresData).toHaveBeenCalled();
  });
});
