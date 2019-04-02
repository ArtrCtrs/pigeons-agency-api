
const expeditionsList =
    [{
        id: 0,
        seeds: 10,
        duration: 10000,
        name: "Garden run",
        reward: [{
            pigeontype: 1,
            probability: 45
        },
        {
            pigeontype: 2,
            probability: 60
        },
        {
            pigeontype: 11,
            probability: 75
        },
        {
            pigeontype: 6,
            probability: 89
        },
        {
            pigeontype: 16,
            probability: 90
        },
        {
            pigeontype: 3,
            probability: 100
        }]
    },
    {
        id: 1,
        seeds: 70,
        duration: 20000,
        name: "Macdonald tour (+def)",
        reward: [{
            pigeontype: 2,
            probability: 10
        },
        {
            pigeontype: 3,
            probability: 20
        },
        {
            pigeontype: 4,
            probability: 25
        },
        {
            pigeontype: 6,
            probability: 65
        },
        {
            pigeontype: 7,
            probability: 84
        },
        {
            pigeontype: 8,
            probability: 94
        }
            ,
        {
            pigeontype: 9,
            probability: 100
        }]
    },
    {
        id: 2,
        seeds: 70,
        duration: 20000,
        name: "Sushi Tour (+atk)",
        reward: [{
            pigeontype: 2,
            probability: 10
        },
        {
            pigeontype: 3,
            probability: 20
        },
        {
            pigeontype: 4,
            probability: 25
        },
        {
            pigeontype: 11,
            probability: 65
        },
        {
            pigeontype: 12,
            probability: 84
        },
        {
            pigeontype: 13,
            probability: 94
        },
        {
            pigeontype: 14,
            probability: 100
        }]
    },
    {
        id: 3,
        seeds: 650,
        duration: 60000,
        name: "Luxury Macdonald Tour (+def)",
        reward: [{
            pigeontype: 3,
            probability: 23
        },
        {
            pigeontype: 8,
            probability: 46
        },
        {
            pigeontype: 4,
            probability: 68
        },
        {
            pigeontype: 9,
            probability: 90
        },
        {
            pigeontype: 5,
            probability: 95
        },
        {
            pigeontype: 10,
            probability: 100
        }]
    },
    {
        id: 4,
        seeds: 650,
        duration: 60000,
        name: "Luxury Sushi Tour (+atk)",
        reward: [{
            pigeontype: 3,
            probability: 23
        },
        {
            pigeontype: 13,
            probability: 46
        },
        {
            pigeontype: 4,
            probability: 68
        },
        {
            pigeontype: 14,
            probability: 90
        },
        {
            pigeontype: 5,
            probability: 95
        },
        {
            pigeontype: 15,
            probability: 100
        }]
    },
    {
        id: 5,
        seeds: 3300,
        duration: 90000,
        name: "London Tour (+def)",
        reward: [{
            pigeontype: 21,
            probability: 45
        },
        {
            pigeontype: 22,
            probability: 88
        },
        {
            pigeontype: 23,
            probability: 100
        }]
    },
    {
        id: 6,
        seeds: 3300,
        duration: 90000,
        name: "Tokyo Tour (+atk)",
        reward: [{
            pigeontype: 26,
            probability: 45
        },
        {
            pigeontype: 27,
            probability: 88
        },
        {
            pigeontype: 28,
            probability: 100
        }]
    },
    {
        id: 7,
        seeds: 7500,
        duration: 120000,
        name: "Luxury London Tour (+def)",
        reward: [
            {
                pigeontype: 23,
                probability: 55
            },
            {
                pigeontype: 24,
                probability: 90
            },
            {
                pigeontype: 25,
                probability: 100
            }]
    },
    {
        id: 8,
        seeds: 7500,
        duration: 120000,
        name: "Luxury Tokyo Tour (+atk)",
        reward: [
            {
                pigeontype: 28,
                probability: 55
            },
            {
                pigeontype: 29,
                probability: 90
            },
            {
                pigeontype: 30,
                probability: 100
            }]
    },
    {
        id: 9,
        seeds: 13500,
        duration: 150000,
        name: "Berlin tour (+def)",
        reward: [
            {
                pigeontype: 51,
                probability: 3
            },
            {
                pigeontype: 31,
                probability: 45
            },
            {
                pigeontype: 32,
                probability: 88
            },
            {
                pigeontype: 33,
                probability: 100
            }]
    },
    {
        id: 10,
        seeds: 13500,
        duration: 150000,
        name: "Singapore tour (+atk)",
        reward: [
            {
                pigeontype: 51,
                probability: 3
            },
            {
                pigeontype: 36,
                probability: 45
            },
            {
                pigeontype: 37,
                probability: 88
            },
            {
                pigeontype: 38,
                probability: 100
            }]
    },
    {
        id: 11,
        seeds: 19000,
        duration: 170000,
        name: "Luxury Berlin tour (+def)",
        reward: [
            {
                pigeontype: 52,
                probability: 3
            },
            {
                pigeontype: 33,
                probability: 55
            },
            {
                pigeontype: 34,
                probability: 90
            },
            {
                pigeontype: 35,
                probability: 100
            }]
    },
    {
        id: 12,
        seeds: 19000,
        duration: 170000,
        name: "Luxury Singapore tour (+atk)",
        reward: [
            {
                pigeontype: 52,
                probability: 3
            },
            {
                pigeontype: 38,
                probability: 55
            },
            {
                pigeontype: 39,
                probability: 90
            },
            {
                pigeontype: 40,
                probability: 100
            }]
    },
    {
        id: 13,
        seeds: 27000,
        duration: 190000,
        name: "New York tour (+def)",
        reward: [
            {
                pigeontype: 53,
                probability: 3
            },
            {
                pigeontype: 41,
                probability: 45
            },
            {
                pigeontype: 42,
                probability: 88
            },
            {
                pigeontype: 43,
                probability: 100
            }]
    },
    {
        id: 14,
        seeds: 27000,
        duration: 190000,
        name: "Shanghai tour (+atk)",
        reward: [
            {
                pigeontype: 53,
                probability: 3
            },
            {
                pigeontype: 46,
                probability: 45
            },
            {
                pigeontype: 47,
                probability: 88
            },
            {
                pigeontype: 48,
                probability: 100
            }]
    },
    {
        id: 15,
        seeds: 34500,
        duration: 190000,
        name: "Luxury New York tour (+def)",
        reward: [
            {
                pigeontype: 54,
                probability: 3
            },
            {
                pigeontype: 43,
                probability: 55
            },
            {
                pigeontype: 44,
                probability: 90
            },
            {
                pigeontype: 45,
                probability: 100
            }]
    },
    {
        id: 16,
        seeds: 34500,
        duration: 190000,
        name: "Luxury Shanghai tour (+atk)",
        reward: [
            {
                pigeontype: 54,
                probability: 3
            },
            {
                pigeontype: 48,
                probability: 55
            },
            {
                pigeontype: 49,
                probability: 90
            },
            {
                pigeontype: 50,
                probability: 100
            }]
    },
    {
        id: 17,
        seeds: 41500,
        duration: 190000,
        name: "Paris tour (+def)",
        reward: [
            {
                pigeontype: 61,
                probability: 45
            },
            {
                pigeontype: 62,
                probability: 88
            },
            {
                pigeontype: 63,
                probability: 100
            }]
    },
    {
        id: 18,
        seeds: 41500,
        duration: 190000,
        name: "Los Angeles tour (+atk)",
        reward: [
            {
                pigeontype: 66,
                probability: 45
            },
            {
                pigeontype: 67,
                probability: 88
            },
            {
                pigeontype: 68,
                probability: 100
            }]
    },{
        id: 19,
        seeds: 50000,
        duration: 190000,
        name: "Luxury Paris tour (+def)",
        reward: [
            {
                pigeontype: 55,
                probability: 3
            },
            {
                pigeontype: 63,
                probability: 55
            },
            {
                pigeontype: 64,
                probability: 91
            },
            {
                pigeontype: 65,
                probability: 100
            }]
    },{
        id: 20,
        seeds: 50000,
        duration: 190000,
        name: "Luxury Los Angeles tour (+atk)",
        reward: [
            {
                pigeontype: 55,
                probability: 3
            },
            {
                pigeontype: 68,
                probability: 55
            },
            {
                pigeontype: 69,
                probability: 91
            },
            {
                pigeontype: 70,
                probability: 100
            }]
    }]

export default expeditionsList;

