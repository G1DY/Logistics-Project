import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const DriversDailyLog = () => {
  const [logData, setLogData] = useState({
    from: "",
    carrier: "",
    homeTerminal: "",
    mileageToday: "",
    totalMileage: "",
    truckTrailer: "",
    remarks: "",
    shippingDocs: "",
    recap: "",
  });

  useEffect(() => {
    const savedLog = localStorage.getItem("driversDailyLog");
    if (savedLog) setLogData(JSON.parse(savedLog));
  }, []);

  useEffect(() => {
    localStorage.setItem("driversDailyLog", JSON.stringify(logData));
  }, [logData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setLogData({ ...logData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Driver's Daily Log</h1>

      <div className="grid grid-cols-2 gap-4">
        <Input
          name="from"
          value={logData.from}
          onChange={handleChange}
          placeholder="From"
        />
        <Input
          name="carrier"
          value={logData.carrier}
          onChange={handleChange}
          placeholder="Name of Carrier"
        />
        <Input
          name="homeTerminal"
          value={logData.homeTerminal}
          onChange={handleChange}
          placeholder="Home Terminal Address"
        />
        <Input
          name="mileageToday"
          value={logData.mileageToday}
          onChange={handleChange}
          placeholder="Total Mileage Today"
        />
        <Input
          name="totalMileage"
          value={logData.totalMileage}
          onChange={handleChange}
          placeholder="Total Miles Driven"
        />
        <Input
          name="truckTrailer"
          value={logData.truckTrailer}
          onChange={handleChange}
          placeholder="Truck/Trailer Number & License"
        />
      </div>

      <textarea
        name="remarks"
        value={logData.remarks}
        onChange={handleChange}
        placeholder="Remarks"
        className="w-full mt-4 p-2 border rounded-md"
      />
      <textarea
        name="shippingDocs"
        value={logData.shippingDocs}
        onChange={handleChange}
        placeholder="Shipping Documents"
        className="w-full mt-4 p-2 border rounded-md"
      />

      <div className="flex justify-end mt-4">
        <Button onClick={() => console.log(logData)}>Save & Submit</Button>
      </div>
    </div>
  );
};
export default DriversDailyLog;
