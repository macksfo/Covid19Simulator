// Simulate a viral infection by creating a population and tracking the spread of a virus
// based on certain assumptions about the population and the virus. 
// The user can change most of the parameters, but there will be defaults
// The population is assumed to know about the virus.
// When someone shows symptoms they are quarantined and cannot spread the virus.


// Population size
var populationSize = 50000;
// # of close social contacts per day per person
// This is the number they initiate.  They could have an unlimited number of contacts initiated by others.  It is not symmetrical.
var contacts = 1;
// Chance of catching virus per close social contact
var contagion = .5;
// Total days contagious
var daysContagious = 14;
// Days til symptoms - if any
var daysToOnset = 2;
// fraction of non-symptomatic persons (super-spreaders)
var noSymptoms = .4;
// number of days to simulate (or 100% infection if that comes first)
var simLength = 80;
// number of initially infected individuals
var infectedAtOnset = 1;

var dayCounter = 0;
var numInfected = 0;
var numSick = 0;
var interaction;
const Uninfected = 0, Contagious = 1, Sick = 2, Immune = 3;

// Let's get started by initializing the population
var population = new Array(populationSize);
for (var i = 0; i < populationSize; i++) {
    population[i] = new Array(2);
    population[i][0] = 0;
    population[i][1] = 1;
}

// infect someone
var infected = Math.floor(populationSize * randomMethod());
population[infected][0] = Contagious;
numInfected++;


while (numInfected < populationSize && dayCounter++ < simLength) {
    // let's interact.  Interactions with Sick people are not specificlly excluded, but they cannot infect because they
    // are assumed to be either cancelled or carried out in a safe manner.
    for (var currentPerson = 0; currentPerson < populationSize; currentPerson++) {
        for (var j = 0; j < contacts; j++) {
            interaction = Math.floor(randomMethod() * (populationSize - 1));
            if (interaction >= currentPerson) interaction++;
            if (population[interaction][0] == Contagious || population[currentPerson][0] == Contagious) {
                if (randomMethod() < contagion) {
                    if (population[currentPerson][0] == Uninfected) {
                        population[currentPerson][0] = Contagious;
                        population[currentPerson][1] = 1;
                        numInfected++;
                    }
                    if (population[interaction][0] == Uninfected) {
                        population[interaction][0] = Contagious;
                        population[interaction][1] = 1;
                        numInfected++;
                    }
                }
            } 
            
        }
    }
    
    for (var currentPerson = 0; currentPerson < populationSize; currentPerson++) {

        if (population[currentPerson][0] == Uninfected || population[currentPerson][0] == Immune) population[currentPerson][1]++;

        if (population[currentPerson][0] == Sick) {
            if (population[currentPerson][1] >= daysContagious) {
                population[currentPerson][0] = Immune;
                population[currentPerson][1] = 1;
            }
            else population[currentPerson][1]++;
        }


        if (population[currentPerson][0] == Contagious) {
            if (population[currentPerson][1]  == daysToOnset) {
                if (randomMethod() > noSymptoms) {
                    population[currentPerson][0] = Sick;
                    numSick++;
                }
                population[currentPerson][1]++;
            }
            else {
                    if (population[currentPerson][1] >= daysContagious) {
                        population[currentPerson][0] = Immune;
                        population[currentPerson][1] = 1;
                    }
                    else population[currentPerson][1]++;
            }
        }
    }
        
    // print results
    console.log("Day ", dayCounter, " Number of Infected ", numInfected, "  Number of Sick  ", numSick);
        
        
}

    


function randomMethod() {
    return(Math.random());
}
