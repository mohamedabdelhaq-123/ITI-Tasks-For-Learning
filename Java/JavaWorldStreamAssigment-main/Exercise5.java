



import java.util.Objects;
import java.util.Optional;

import static java.lang.System.out;
import static java.util.Comparator.comparing;
import static java.util.stream.Collectors.maxBy;

/*
• Find the highest populated capital city
*/

public class Exercise5 
{
    public static void main(String[] args) {
        CountryDao countryDao = InMemoryWorldDao.getInstance();
        CityDao cityDao = InMemoryWorldDao.getInstance();
       //write your answer here 

       // list countries
       // stream of countries
       // stream of capital ids
       // stream of capital cities
       // optioanl max => non null optional max => max
       // print 
       
       City mycity=
       countryDao.findAllCountries()
       .stream()
       .map(Country::getCapital)
       .map(cityDao::findCityById)
       .filter((city)-> city!=null)
       .max(comparing(City::getPopulation))
       .get();
       
       System.out.print(mycity);

    }

}