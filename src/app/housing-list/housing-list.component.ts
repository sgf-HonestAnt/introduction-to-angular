import { Component, OnInit, Input , Output, EventEmitter} from '@angular/core';
import { HousingLocation } from '../housing-location';

@Component({
  selector: 'app-housing-list',
  templateUrl: './housing-list.component.html',
  styleUrls: ['./housing-list.component.css'],
})
export class HousingListComponent implements OnInit {
  @Input() locationList: HousingLocation[] = [];
  @Output() selectedLocationEvent = new EventEmitter<HousingLocation>();
  results: HousingLocation[] = [];

  constructor() {}

  ngOnInit(): void {}

  searchHousingLocations(
    searchText: string,
    wifiChecked: boolean,
    laundryChecked: boolean,
    unitsChecked: boolean
  ) {
    const list = this.locationList.filter((location) => {
      if (laundryChecked && !location.laundry) return;
      if (wifiChecked && !location.wifi) return;
      if (unitsChecked && location.availableUnits < 1) return;
      if (unitsChecked && wifiChecked && laundryChecked)
        return location.wifi && location.laundry && location.availableUnits > 0;
      if (!unitsChecked && wifiChecked && laundryChecked)
        return location.wifi && location.laundry;
      if (unitsChecked) return location.availableUnits > 0;
      return location;
    });

    console.log({list})

    this.results =
      !searchText && !wifiChecked && !laundryChecked && !unitsChecked
        ? []
        : !searchText || searchText === '*'
        ? list
        : list.filter((location) => {
            let states =
              location.state.toLowerCase() === searchText.toLowerCase();
            if (searchText.length < 3) return states;
            let cities = location.city
              .toLowerCase()
              .includes(searchText.toLowerCase());
            let names = location.name
              .toLowerCase()
              .includes(searchText.toLowerCase());
            return cities || names || false;
          });
  }

  selectHousingLocation(location: HousingLocation) {
    this.selectedLocationEvent.emit(location);
  }
}
