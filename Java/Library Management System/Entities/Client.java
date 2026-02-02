package Entities;
public class Client 
{
    private int id;
    private String clientName;
    private String email;

    // const.
    public Client(int id,String name,String email)
    {
        this.id=id;
        this.clientName=name;
        this.email=email;
    }

    // getters
    public int getId(){return this.id;}
    public String getClientName(){return this.clientName;}
    public String getEmail(){return this.email;}

    // setters
    public void setId(int id){this.id=id;}
    public void setClientName(String name){this.clientName=name;}
    public void setEmail(String email){this.email=email;}

    // methods
    public String getClientDetails(int id)
    {
        // code
        return "======> Client Data <====== "+'\n'+   "Client: "+this.clientName+'\n'+"ID: "+this.id+ '\n'+"Email: "+this.email;

        //System.out.println("Name: "+this.clientName+" ID: "+this.id+" Email: "+this.email);
    }



}