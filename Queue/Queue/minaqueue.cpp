
#include <iostream>
using namespace std;

/*
Simple Queue :
  problems : deleted Elements cant Be reused
  solution : Circular Queue

Delete ===> Front
Insert ===> Rear
==================================================
Circular Queue
Delete ===> Front
Insert ===> Rear
==================================================
Priority Queue

Delete ===> Priority, Front
Insert ===>  Rear
==================================================
Double Ended Queue
=============================
Input Restricted  [One Inertion , Both Delete]
insertRear();
deleteFront();
deleteRear();



Output Restricted
insertRear();
insertFront();
deleteFront();


Lab
-Deque (Double-Ended Queue)  using Circle
- void insertFront(int data) : Adding an element to the front.
- int deleteRear() : Removing an element from the back.
-Queu With Linkedlist

*/
class Queue{
    private :
        int * items ;
        int rear ; //EnterIndex
        int fornt; //OutIndex
        int capicty;
        int size;
    public:
    //int fornt; //OutIndex
    Queue(int capicty)
    {
        rear=-1;
        fornt=-1;
        //size=0;
        this->capicty=capicty;
        items=new int[capicty];
    }
    ~Queue()
    {
        delete [] items;
    }
    void enterData(int item){   //insertRear
        //Check Full
        if((fornt == 0 && rear == capicty-1 ) || (fornt == rear +1 )){
          //if(size == capicty){}
            //Resize Dynamic Array
            cout<<"is Full "<<endl;
            return ;
        }

        //Setting Rear and Front
        //First Element
        if(rear == -1 &&  fornt == -1  ){
            rear=0;
            fornt=0;
        }else if (rear == capicty-1){ //&& fornt != 0
            rear=0;
        }else{
            rear++;
        }
        //Add item
        items[rear]=item;
        //size++;

    }
    int remove(){  // deleteFront
        //Check Empty
        if(fornt == -1 ){cout<<"Empty Queue" ; return -1;}
        //if(size == 0 ){cout<<"Empty Queue" ; return -1;}

        //Backup Item
        int temp = items[fornt];
        //Delete Item
        items[fornt]=-10;//-10 for Debug
        //Change Front and Rear
        if(fornt == rear ){
         fornt =-1;
         rear=-1;
        }else if (fornt == capicty -1 ){
            fornt =0;
        }
        else{
            fornt ++;
        }
        //return Item
        //size--;
        return temp;
    }

    void display(){
    cout<<"\n========================================\n";

        //Empty
        if(fornt == -1 ){cout<<"Empty Queue" ; return ;}
        /*if(fornt <= rear){
            for (int i= fornt ; i<= rear; i++){
                cout<<items[i]<< "\t";
            }
        }else { //fornt >= rear
            for (int i= fornt ; i< capicty; i++){
                cout<<items[i]<< "\t";
            }
            for (int i= 0 ; i<= rear; i++){
                cout<<items[i]<< "\t";
            }

        }*/
        //rear =0 front =1
        //fornt 3   rear = 2   3 4 0 1 2
        int i = (fornt)%capicty; // 3%5 ===> 3
        while(i != rear){
            cout<<items[i]<< "\t";
            i=(i+1)%capicty;
        }
        cout<<items[rear];
        cout<<"\n========================================\n";
    }



    void insertFront(int item){


    }
    void deleteRear(){

    }
};


/*



int main()
{
     Queue q(5);
     q.enterData(10);
     q.enterData(20);
     q.enterData(30);
     q.enterData(40);
     q.enterData(50);
     q.enterData(60);
     q.display();//10 20 30 40 50
     cout<< "data is "<<q.remove()<<endl;//10
     cout<< "data is "<<q.remove()<<endl;//20
     q.display();//30 40 50
     q.enterData(70); //rear = 0
     q.enterData(80); //rear = 1
     q.display();//30 40 50 70 80
     cout<< "data is "<<q.remove()<<endl;//30
     cout<< "data is "<<q.remove()<<endl;//40
     cout<< "data is "<<q.remove()<<endl;//50
     cout<< "data is "<<q.remove()<<endl;//70
     cout<< "data is "<<q.remove()<<endl;//80
     cout<< "data is "<<q.remove()<<endl;//Empty -1
     q.display();//Empty

     q.enterData(90);
     q.enterData(100);
     q.enterData(1000);
     q.display();//90 100 1000
    cout << "Hello world!" << endl;




    return 0;
}
*/
