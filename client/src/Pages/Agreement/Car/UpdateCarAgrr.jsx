
import CarAgrTemplate from './CarAgrTemplate'
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useAuth } from '../../../hooks/AuthContext';
import { GetAggreementsByID } from '../../../Api/Agreement';

export default function UpdateCarAgrr() {

     const { user } = useAuth();
    
      const [aggrementDetail, setAggrementDetail] = useState({
        place: "",
        timeInDayCount: "",
        rentAmount: "",
      });
      const [ownerConfirmed, setOwnerConfirmed] = useState(true); //done
      const [renterConfirmed, setRenterConfirmed] = useState(false); //done
      const [renterDetails, setRenterDetails] = useState(""); // done
      const [ownerDetail, setOwnerDetail] = useState(""); // done
      const [listingDetail, setListingDetail] = useState([]); //done
      const [checkCreateAgrr, setCheckCreateAggr] = useState(true);
      const [mainDetails, setMainDetails] = useState('');
      
    
      const { id } = useParams();
    
      useEffect(() => {
        const fetchSpecificAgreementDetail = async () => {
          try {
            if (!user) {
              return;
            }
            if (!id) {
              return;
            }
    
            console.log("id of agreement", id);
            const response = await GetAggreementsByID(id);
            console.log("resp in updateAgreement", response);
    
            console.log(
              "aggr detail",
              response.data.data.agreementDetailsId.aggrementDetail
            );
            const aggrDetail =
              response.data?.data?.agreementDetailsId?.aggrementDetail;
            setAggrementDetail({
              ...aggrementDetail,
     createdDate:aggrDetail.createdDate ,
    startDate: aggrDetail.startDate,
    endDate: aggrDetail.endDate,
    advanceRent: aggrDetail.advanceRent,
    advanceRentMonths: aggrDetail.advanceRentMonths,
    securityDeposit: aggrDetail.securityDeposit,
    securityDepositMonths: aggrDetail.securityDepositMonths,
    rentIncreasePercentage: aggrDetail.rentIncreasePercentage,
    registrationNum:aggrDetail.registrationNum,
    make:aggrDetail.make,
    carModel:aggrDetail.carModel,
    engineNum:aggrDetail.engineNum,
    ChassisNum:aggrDetail.ChassisNum,
    RentAmount:aggrDetail.RentAmount,
    rentTime:aggrDetail.rentTime,
    installments:aggrDetail.aggrDetail,
    crossedChequeAmount:aggrDetail.crossedChequeAmount,
    oilChangeTime:aggrDetail.oilChangeTime,
    tuningTime:aggrDetail.tuningTime,
    meetingOwnerDate:aggrDetail.meetingOwnerDate,
    noticePeriod:aggrDetail.noticePeriod,
    agreementPoints: Array.isArray(aggrDetail.agreementPoints)
    ? aggrDetail.agreementPoints.map((point) => ({
        ...point, // Keep existing fields in the object
    
      }))
    : [],
 });
 setMainDetails(response?.data?.data);
            console.log("renter detail", response.data.data.renterId);
            setRenterDetails(response.data.data.renterId);
            setOwnerDetail(response.data.data.ownerId);
    
          setOwnerConfirmed(response.data?.data?.ownerConfirmed);
            setRenterConfirmed(response.data?.data?.renterConfirmed);
    
            console.log("listing", response.data?.data?.listingId);
            setListingDetail(response.data?.data?.listingId);
          } catch (error) {
            console.log("errr", error);
          }
        };
        fetchSpecificAgreementDetail();
      }, [id, user]);
    
      const OwnerConfirmedFunc = async () => {
        if (ownerConfirmed) {
          setOwnerConfirmed(false);
        } else {
          setOwnerConfirmed(true);
        }
      };
    //   const RenterConfirmed = async () => {
    //     if (renterConfirmed) {
    //       setRenterConfirmed(false);
    //     } else {
    //       setRenterConfirmed(true);
    //     }
    //   };

    const handleChange = (e) => {
      const { name, value } = e.target;
      setAggrementDetail((prev) => ({
          ...prev,
          [name]: value,
      }));
  };

  const updateAgreement = async()=>{
    console.log("Updated form data is::: ",aggrementDetail)
  }
  return (
    <div>
        <CarAgrTemplate 
        updateAgreement= {updateAgreement}
        handleChange={handleChange}
        mainDetails = {mainDetails}
        OwnerConfirmedFunc={OwnerConfirmedFunc} ownerConfirmed={ownerConfirmed}  
        setAggrementDetail={setAggrementDetail} formData={aggrementDetail} setRenterDetails={setRenterDetails}
         tenant={renterDetails} checkCreateAgrr={checkCreateAgrr}
           />
      
    </div>
  )
}
