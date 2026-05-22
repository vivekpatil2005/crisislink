import Float "mo:core/Float";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Time "mo:core/Time";

actor {
  type SOSAlert = {
    id : Nat;
    name : Text;
    message : Text;
    latitude : Float;
    longitude : Float;
    timestamp : Int;
  };

  type SafeZone = {
    id : Nat;
    name : Text;
    zoneType : Text;
    state : Text;
    district : Text;
    latitude : Float;
    longitude : Float;
  };

  module SOSAlert {
    public func compare(alert1 : SOSAlert, alert2 : SOSAlert) : Order.Order {
      Int.compare(alert2.timestamp, alert1.timestamp);
    };
  };

  var nextSosId = 1;
  let sosAlerts = Map.empty<Nat, SOSAlert>();
  let safeZoneEntries : [(Nat, SafeZone)] = [
    (0, { id = 0; name = "Mumbai Hospital"; zoneType = "Hospital"; state = "Maharashtra"; district = "Mumbai"; latitude = 19.076; longitude = 72.8777 }),
    (1, { id = 1; name = "Delhi Hospital"; zoneType = "Hospital"; state = "Delhi"; district = "Central"; latitude = 28.6139; longitude = 77.209 }),
    (2, { id = 2; name = "Bangalore Shelter"; zoneType = "Shelter"; state = "Karnataka"; district = "Bangalore"; latitude = 12.9716; longitude = 77.5946 }),
    (3, { id = 3; name = "Chennai Hospital"; zoneType = "Hospital"; state = "Tamil Nadu"; district = "Chennai"; latitude = 13.0827; longitude = 80.2707 }),
    (4, { id = 4; name = "Kolkata Hospital"; zoneType = "Hospital"; state = "West Bengal"; district = "Kolkata"; latitude = 22.5726; longitude = 88.3639 }),
    (5, { id = 5; name = "Hyderabad Exit"; zoneType = "Exit"; state = "Telangana"; district = "Hyderabad"; latitude = 17.385; longitude = 78.4867 }),
    (6, { id = 6; name = "Pune Hospital"; zoneType = "Hospital"; state = "Maharashtra"; district = "Pune"; latitude = 18.5204; longitude = 73.8567 }),
    (7, { id = 7; name = "Ahmedabad Hospital"; zoneType = "Hospital"; state = "Gujarat"; district = "Ahmedabad"; latitude = 23.0225; longitude = 72.5714 }),
    (8, { id = 8; name = "Jaipur Shelter"; zoneType = "Shelter"; state = "Rajasthan"; district = "Jaipur"; latitude = 26.9124; longitude = 75.7873 }),
    (9, { id = 9; name = "Lucknow Hospital"; zoneType = "Hospital"; state = "Uttar Pradesh"; district = "Lucknow"; latitude = 26.8467; longitude = 80.9462 }),
    (10, { id = 10; name = "Bhopal Shelter"; zoneType = "Shelter"; state = "Madhya Pradesh"; district = "Bhopal"; latitude = 23.2599; longitude = 77.4126 }),
    (11, { id = 11; name = "Chandigarh Hospital"; zoneType = "Hospital"; state = "Punjab"; district = "Chandigarh"; latitude = 30.7333; longitude = 76.7794 }),
    (12, { id = 12; name = "Goa Exit"; zoneType = "Exit"; state = "Goa"; district = "Panaji"; latitude = 15.2993; longitude = 74.124 }),
    (13, { id = 13; name = "Patna Hospital"; zoneType = "Hospital"; state = "Bihar"; district = "Patna"; latitude = 25.5941; longitude = 85.1376 }),
    (14, { id = 14; name = "Guwahati Shelter"; zoneType = "Shelter"; state = "Assam"; district = "Guwahati"; latitude = 26.1445; longitude = 91.7362 }),
    (15, { id = 15; name = "Nagpur Hospital"; zoneType = "Hospital"; state = "Maharashtra"; district = "Nagpur"; latitude = 21.1458; longitude = 79.0882 }),
    (16, { id = 16; name = "Coimbatore Hospital"; zoneType = "Hospital"; state = "Tamil Nadu"; district = "Coimbatore"; latitude = 11.0168; longitude = 76.9558 }),
    (17, { id = 17; name = "Indore Shelter"; zoneType = "Shelter"; state = "Madhya Pradesh"; district = "Indore"; latitude = 22.7196; longitude = 75.8577 }),
    (18, { id = 18; name = "Kochi Exit"; zoneType = "Exit"; state = "Kerala"; district = "Ernakulam"; latitude = 9.9312; longitude = 76.2673 }),
    (19, { id = 19; name = "Surat Hospital"; zoneType = "Hospital"; state = "Gujarat"; district = "Surat"; latitude = 21.1702; longitude = 72.8311 }),
    (20, { id = 20; name = "Agra Shelter"; zoneType = "Shelter"; state = "Uttar Pradesh"; district = "Agra"; latitude = 27.1767; longitude = 78.0081 }),
    (21, { id = 21; name = "Varanasi Hospital"; zoneType = "Hospital"; state = "Uttar Pradesh"; district = "Varanasi"; latitude = 25.3176; longitude = 82.9739 }),
    (22, { id = 22; name = "Meerut Hospital"; zoneType = "Hospital"; state = "Uttar Pradesh"; district = "Meerut"; latitude = 28.9845; longitude = 77.7064 }),
    (23, { id = 23; name = "Ludhiana Shelter"; zoneType = "Shelter"; state = "Punjab"; district = "Ludhiana"; latitude = 30.9005; longitude = 75.8573 }),
    (24, { id = 24; name = "Amritsar Hospital"; zoneType = "Hospital"; state = "Punjab"; district = "Amritsar"; latitude = 31.634; longitude = 74.8723 }),
    (25, { id = 25; name = "Kanpur Hospital"; zoneType = "Hospital"; state = "Uttar Pradesh"; district = "Kanpur"; latitude = 26.4499; longitude = 80.3319 }),
    (26, { id = 26; name = "Thiruvananthapuram Hospital"; zoneType = "Hospital"; state = "Kerala"; district = "Thiruvananthapuram"; latitude = 8.5241; longitude = 76.9366 }),
    (27, { id = 27; name = "Ranchi Shelter"; zoneType = "Shelter"; state = "Jharkhand"; district = "Ranchi"; latitude = 23.3441; longitude = 85.309 }),
    (28, { id = 28; name = "Vijayawada Hospital"; zoneType = "Hospital"; state = "Andhra Pradesh"; district = "Vijayawada"; latitude = 16.5062; longitude = 80.648 }),
    (29, { id = 29; name = "Madurai Exit"; zoneType = "Exit"; state = "Tamil Nadu"; district = "Madurai"; latitude = 9.9252; longitude = 78.1198 })
  ];

  let safeZones = Map.fromIter<Nat, SafeZone>(safeZoneEntries.values());

  func getSosAlertInternal(id : Nat) : SOSAlert {
    switch (sosAlerts.get(id)) {
      case (?alert) { alert };
      case (null) { Runtime.trap("SOS alert not found") };
    };
  };

  public shared ({ caller }) func submitSos(name : Text, message : Text, latitude : Float, longitude : Float) : async SOSAlert {
    if (name.size() == 0 or name.size() > 100) {
      Runtime.trap("Invalid name. Must be 1-100 characters");
    };

    if (message.size() == 0 or message.size() > 500) {
      Runtime.trap("Invalid message. Must be 1-500 characters");
    };

    let newSos : SOSAlert = {
      id = nextSosId;
      name;
      message;
      latitude;
      longitude;
      timestamp = Time.now();
    };

    sosAlerts.add(nextSosId, newSos);
    nextSosId += 1;
    newSos;
  };

  public query ({ caller }) func getLatestAlerts() : async [SOSAlert] {
    let latestAlerts = sosAlerts.values().toArray().sort().sliceToArray(0, Nat.min(100, sosAlerts.size()));
    latestAlerts;
  };

  public query ({ caller }) func getSafeZones() : async [SafeZone] {
    safeZones.values().toArray();
  };

  public query ({ caller }) func filterSafeZonesByType(zoneType : Text) : async [SafeZone] {
    safeZones.values().toArray().filter(func(zone) { Text.equal(zone.zoneType, zoneType) });
  };

  public query ({ caller }) func filterSafeZonesByState(state : Text) : async [SafeZone] {
    safeZones.values().toArray().filter(func(zone) { Text.equal(zone.state, state) });
  };
};
