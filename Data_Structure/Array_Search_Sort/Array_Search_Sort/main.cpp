#include <iostream>

using namespace std;

class Array
{
private:

    int * arr;
    int size;
    int index;

    void swapHelperFunc(int* x,int* y) // by ptr
    {
        int temp=*x;
        *x =*y;
        *y= temp;
    }

    void swapHelplerFuncByRef(int& x,int& y)
    {
        int temp=x;
        x =y;
        y= temp;
    }

public:

    Array(int userSize=5)
    {
        index=0;
        size= userSize;
        arr = new int[userSize];
    }

    void addArrayElement(int data)
    {
        if(size>index)
            arr[index++]=data;
    }

    void bubbleSort() // asce
    {
        // compare then swap
        // 2 counters
        // check till n
        // if then swap
        // the biggest is at end

        bool sortedTest = true;
        for(int i=0; i<size; i++)
        {
            for(int j=0; j<size-1-i; j++) // j=8 8<10  j=9 9<10 , so
            {
                if(arr[j] > arr[j+1])   // comp btw 8 and 9 , comp btw 9 and 10 (arroutofIndex)
                {
                    swapHelplerFuncByRef(arr[j],arr[j+1]);
                    sortedTest=false;
                }


            }
            if(i==0 && sortedTest) return ;

            // optimizations
            // 1. if already sorted
            // 2. dec loop so don't check recent sorted elements  ==> size-1 -i, bec after each inner loop there is one sorted element from behind

        }

    }

    void selectionSort(void)
    {
        int minIndex=0;
        for(int i=0; i<size; i++) //  1 ,6 8 10 3 2 4 1 34
        {
            //min=arr[i];
            //c=-1;
            minIndex=i;
            for(int j=i+1; j<size; j++)
            {
                if(arr[minIndex]>arr[j])
                {
                    /*min=arr[j];
                    c=j;*/
                    minIndex=j;
                }
            }
            if(minIndex!=i)    // swap when need to swap
                swapHelplerFuncByRef(arr[i],arr[minIndex]); //  1 ,2, 8 10 6 3 4 1 34
        }

    }

    /* void insertionSort(void)
     {
         for(int i=1;i<size;i++)
         {
             for(int j=i-1;j>=0;j--)
             {
                 if(arr[i]<arr[j])  // if all before me less then swap
                 {
                     swapHelplerFuncByRef(arr[i],arr[j]);
                     i=j-1;
                 }
             }
         }
     }*/

    // 2 4 5 3 8 6
    // i3,j2,, 3<5 ==>  // 2 4 3 5 8 6 ,,i3(5),, j2(3) ==> i2(3) ,,j

    void insertionSort(void)
    {
        int j=0;
        for(int i = 1; i < size; i++)
        {
            j = i;
            while(j > 0 && arr[j] < arr[j-1])
            {
                swapHelplerFuncByRef(arr[j], arr[j-1]);
                j--;
            }
        }
    }

    void displayArr(void)
    {
        for(int i=0; i<size; i++)
        {
            cout<<arr[i]<<"  ";
        }
        cout<<endl<<"=========================================="<<endl;
    }


    int linearSearch(int item)
    {
        for(int i=0; i<size; i++)
        {
            if(arr[i]==item) return i;
        }
        return -1;
    }

    int binarySearch(int item)   // 1 2 x 4 5 6 7  (3)  ei6 mi3
    {
        int start=0,end=size-1,mid;

        while(start<=end)
        {
            // mid=(start+end)/2;  may occur overflow
            mid= start+(end-start)/2;

            if(item==arr[mid]) return mid;
            if(item>arr[mid])
            {
                start=mid+1;             //s1 m1  //si2 mi1
            }
            else if(item<arr[mid])
            {
                end=mid-1;          // ei3 mi1

            }
        }
        return -1;
    }

    ~Array()
    {
        delete [] arr;
    }

};


int main()
{
    Array arr(14);
    arr.addArrayElement(3);
    arr.addArrayElement(6);
    arr.addArrayElement(8);
    arr.addArrayElement(10);
    arr.addArrayElement(1);
    arr.addArrayElement(2);
    arr.addArrayElement(4);
    arr.addArrayElement(1);
    arr.addArrayElement(34);
    arr.displayArr();
    //arr.bubbleSort();
    //arr.selectionSort();
    arr.insertionSort();
    arr.displayArr();
  cout<<arr.binarySearch(3)<<endl;
    Array ar(4);
    ar.addArrayElement(4);
    ar.addArrayElement(3);
    ar.addArrayElement(2);
    ar.addArrayElement(1);
    ar.displayArr();
    ar.insertionSort();
    ar.displayArr();
    cout<<ar.linearSearch(3);


    cout << "Hello world!" << endl;
    return 0;
}
