

import static java.lang.System.nanoTime;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.ArrayList;


/*
• Find the highest populated city of each country
• Find the most populated city of each continent
• Find the highest populated capital city
*/

// bool ispresent()  
// bool isEmpty()
// ifPresent(func)
// value(city) get


// map from of to of
public class Exercise1 
{
   public static void main(String[] args) 
   {
      CountryDao countryDao= InMemoryWorldDao.getInstance();
      //write your answer here
      List<City> maxCitiesList=            //list of cities collection
      countryDao.findAllCountries()   //list of countries 
      .stream()                    // stream of countries
      .map(Country::getCities)      //stream of list of cities (values without key)
      .map(List::stream)            //stream of stream of cities (make operations on each group of cities in an unkown country)  // stream func no input
      .map((streamOfCities)-> 
                 streamOfCities.max(Comparator.comparing(City::getPopulation))  // population of ech city in certain country -> compared in table -> take max city of each country 
      ) // Stream of Optional Max cities (due to max())
      .filter(Optional::isPresent)   // stream of non null optional max cities
      .map(Optional::get)            // stream of max cities
      .collect(Collectors.toList()); // list of max cities

      for(City city : maxCitiesList)
      {
         System.out.println("Max city: "+ city.getName()+ "  in Country: "+ countryDao.findCountryByCode(city.getCountryCode()).getName());
      }

      System.out.println(maxCitiesList.size());
      
   } 
}
// if cities then gama3 cities then compare
// if countries already metgama3 , just compare


// city from country >> findCity
// Citiess >> findCities
// get all cities worldwide>> findALL

