import React, { useState, useEffect } from "react";
import { View, Center } from 'native-base';
import { AbstractChart, ContributionGraph, LineChart } from 'react-native-chart-kit';
import { Dimensions } from "react-native";

const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => `rgba(10, 10, 10, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
  };

const windowWidth = Dimensions.get('screen').width;

function getMonthLabels() {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const lastSixMonths = [];
    for (let i = 6; i > 0; i--) {
        let monthIndex = new Date().getMonth() - i;
        let year = new Date().getFullYear();
        if (monthIndex < 0) {
            monthIndex += 12;
            year -= 1;
        }
        const monthName = months[monthIndex];
        lastSixMonths.push(`${monthName} ${year}`);
    }
    return lastSixMonths;
}

const FrequencyHeatMap = (props) => {
    //generate data points

    //generate labels

    const data = {
        labels: getMonthLabels(),
        datasets: [
            {
                //data: [20, 45, 28, 80, 130, 43],
                data: props.dataInput,
                color: (opacity = 1) => `rgba(126, 34, 212, ${opacity})`,
                strokeWidth: 3
            }
        ],
        //legend: ["Workouts"]
      };

    return(
        <Center borderWidth={0} rounded={10} mt='2'>
            <LineChart
                verticalLabelRotation={300}
                xLabelsOffset={50}
                data={data}
                width={.8 * windowWidth}
                height={250}
                chartConfig={chartConfig}
                style={{
                    marginTop: 8,
                    paddingBottom: 30,
                }}
            />
        </Center>
    )
}

export default FrequencyHeatMap;