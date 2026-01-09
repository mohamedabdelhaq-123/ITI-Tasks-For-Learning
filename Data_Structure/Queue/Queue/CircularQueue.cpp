

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





class CircularQueue{

    private:
    int front;
    int rear;
    int capacity;
    int *items;  // to point on first loc. in arr
    int queueSize;

    public:
    CircularQueue(int userCapacity=10)
    {
        this->queueSize=0;
        this->capacity= userCapacity;
        this->front=this->rear=-1;     // init at first
        if(capacity<=0) this->capacity=1; // to avoid items[0] ==>
        items = new int[capacity];  // dynamic arr
    }

    void enqueueRear(int data)  //
    {

      if(queueSize==capacity) return ; // Full Queue

      if(queueSize==0)
      {
        front=rear=0;         // first element
      }
      else
      {
          rear++;
          rear=rear%capacity;
      }
      queueSize++;
      items[rear]=data;
    }

    void dequeueFront(void)  // my own implementation is to just replace the iteam[] with -99
    {

        if(queueSize==0) return ; // Empty Queue


        items[front]=-99; // deleteted
        front++;
        front=front%capacity;
        queueSize--;
    }

    void enqueueFront(int data)
    {
        if(queueSize==capacity) return ; // Full Queue

          if(queueSize==0)
          {
            front=rear=0;         // first element
          }
          else
          {
              front--;
              front=(front+capacity)%capacity;  // -1+ 3==> 2 "last index" % 3= 2
          }
          queueSize++;
          items[front]=data;


    }

     void dequeueRear(void)
     {
        if(queueSize==0) return ; // Empty Queue


        items[rear]=-99; // deleteted
        rear--;
        rear=(rear+capacity)%capacity;
        queueSize--;
     }


    void displayQueue(void) const
    {
        if(queueSize==0)
            return ;

        if(rear>=front)
        {
            for(int i=front;i<=rear;i++)  // from front to rear to show exiting iteam not deleted
            {
                cout<<items[i]<<"  ";
            }
                cout<<endl;
                cout<<"====================================="<<endl;
        }
        else  // if front bigger than rear which means circularity is occured
        {
            for(int i=front;i<capacity;i++)  // from front to capacity bec it is the first inpu
            {
                cout<<items[i]<<"  ";
            }
            for(int i=0;i<=rear;i++)  // after overlapping
            {
                cout<<items[i]<<"  ";
            }

            cout<<endl;
            cout<<"====================================="<<endl;
        }

    }

    ~CircularQueue()
    {
        delete [] items;
    }

};



/*
int main()
{
 CircularQueue q(5);

    cout << "Test : enqueueRear" << endl;
    q.enqueueRear(10);
    q.enqueueRear(20);
    q.enqueueRear(30);
    q.displayQueue();  // Expected: 10 20 30

    cout << "Test : dequeueFront" << endl;
    q.dequeueFront();
    q.displayQueue();  // Expected: 20 30

    cout << "Test : enqueueFront" << endl;
    q.enqueueFront(5);
    q.displayQueue();  // Expected: 5 20 30

    cout << "Test : dequeueRear" << endl;
    q.dequeueRear();
    q.displayQueue();  // Expected: 5 20

    return 0;
}*/

