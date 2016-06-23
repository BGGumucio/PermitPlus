  $(function(){
      onLoadWelcome();
});

function getInfo(){
        $.ajax({
             type: "GET",
             url: "http://localhost:1337/index",
             dataType: "json",
             success: printInfo
        }).fail(function(){
            console.log("It Blew Up")
        });
}

function printInfo(data){
    console.log("in Print info");
    console.log(data);
}    

function onLoadWelcome(){
    var $welcome = $("<h1>Welcome</h1>");
    $("#work-area").append($welcome);
    var $apply = $("<button>Apply For Permit</button>");
    $apply.attr("id", "apply");
    $("#work-area").append($apply);
    var $review = $("<button>Review Approved Permit</button>");
    $review.attr("id", "review");
    $("#work-area").append($review);
    var $status = $("<button>Check Status of Permit</button>");
    $status.attr("id", "status");
    $("#work-area").append($status);
    $("#apply").click(function(e){
          e.preventDefault();
          applyPermit();
	});
    $("#review").click(function(e){
          e.preventDefault();
          reviewPermit();
	});
    $("#status").click(function(e){
          e.preventDefault();
          statusPermit();
	});
}

function applyPermit(){
    console.log("In Apply Method");
    $("#work-area").empty();
    var $header = $("<h2>Permit Application</h2></br><h3>Please fill out as accurately as possible</h3>");
    $("#work-area").append($header);
    var $form = $("<form id ='permitForm'>");
    $form.append("Job Address: <input type='text' name='jobaddress'></br>");
    $form.append("City: <input type='text' name='city'>");
    $form.append("State: <input type='text' name='state'>");
    $form.append("</br>Zipcode: <input type='text' name='zipcode'>");
    $form.append("</br></br>Estimated Value: <input type='text' name='value'>");
    $form.append("</br> Job Description: <input type='text' name='description'>");
    $form.append("</br></br><b>Contact Information</b></br>Applicant <input type='text' name='applicant'>");
    $form.append("Phone: <input type='text' name='appphone'>");
    $form.append("Email: <input type='text' name='appemail'>");
    $form.append("</br>Contact Person <input type='text' name='contact'>");
    $form.append("Phone: <input type='text' name='contactphone'>");
    $form.append("Email: <input type='text' name='contactemail'>");
    $form.append("</br>Architect <input type='text' name='architect'>");
    $form.append("Phone: <input type='text' name='architectphone'>");
    $form.append("Email: <input type='text' name='architectemail'>");
    $form.append("</br></br><b>Property Owner Information</b></br>");
    $form.append("Name: <input type='text' name='ownername'></br>");
    $form.append("Address: <input type='text' name='owneraddress'></br>");
    $form.append("City: <input type='text' name='ownercity'>");
    $form.append("State: <input type='text' name='ownerstate'>");
    $form.append("</br>Zipcode: <input type='text' name='ownerzipcode'>");
    $form.append("Phone: <input type='text' name='ownerphone'>");
    $form.append("</br></br><b>Contractor Information</b></br>");
    $form.append("Name: <input type='text' name='contractorname'></br>");
    $form.append("Address: <input type='text' name='contractoraddress'></br>");
    $form.append("City: <input type='text' name='contractorcity'>");
    $form.append("State: <input type='text' name='contractorstate'>");
    $form.append("</br>Zipcode: <input type='text' name='contractorzipcode'>");
    $form.append("Phone: <input type='text' name='contractorphone'>");
    $form.append("</br></br><b>E-Sign</b>");
    $form.append("</br>I hereby certify that all the above information is factually correct");
    $form.append("</br></br>Applicants Full Name: <input type='text' name='fullname'>");
    $form.append("Date: <input type='date' name='date'>");
    $form.append("</br></br><input type='submit' id ='submit' name='submit'>");
    $("#work-area").append($form);
    $("#submit").click(function(e){
          e.preventDefault();
          aggregateData();
          console.log("submit clicked");
	});
}
function reviewPermit(){
    console.log("In Review Method");
     $.ajax({
             type: "GET",
             url: "/index",
             dataType: "json",
             success: listPermits
        }).fail(function(){
            console.log("It Blew Up")
        });
}

function statusPermit(){
    console.log("In Status Method");
    $("#work-area").empty();
}
function aggregateData(){
    var object = {};
    var array = $("#permitForm").serializeArray();
    $.each(array, function(){
      object[this.name] = this.value;
      console.log(this.name);
    });
    $.ajax({
        type: "POST",
         url: "/permitapp",
        data: object,
        dataType: "json",
        success: function(data){alert(data);},
        failure: function(errMsg) {
            alert(errMsg);
        }
    });
}

function listPermits(data){
    $("#work-area").empty();
    console.log(data);
    var $listHead = $("<p>Current Pending/Approved Permits</p>");
    $("#work-area").append($listHead);
    var $table = ("<table id='permitList'></table>");
    $listHead.append($table);
    var $list = $("<ul></ul>");
    $list.append("<tr><b><td>Permit Number</td><td>Applicant Name</td><td>Applicant Email</td><td>Job Address</td><td>City</td><td>State</td></b></tr>");
    $.each( data, function( key, value ) {
        console.log( key + ": " + value );
        var $row = $("<tr>");
        var $permitNum = $("<td>" + value._id + "</td>");
        var $appNm = $("<td>" + value.Applicant.Applicant_Name + "</td>");
        var $appEmail = $("<td>" + value.Applicant.Applicant_Email + "</td>");
        var $projAdd = $("<td>" + value.Project.Job_Address + "</td>");
        var $projCity = $("<td>" + value.Project.City + "</td>");
        var $projState = $("<td>" + value.Project.State + "</td>");                
        var $clickIn = $("<td id='"+ value._id + "'>View Permit</td>");
        $row.append($permitNum, $appNm, $appEmail, $projAdd, $projCity, $projState, $clickIn);
        $list.append($row);
        $clickIn.click(function(e){
            var $singleId = $(this).attr("id");
            console.log($singleId + "Clicked");
            getSingle($singleId);
        });
       
    });
    $("#permitList").append($list);
}
function getSingle(idNumber){
    console.log(idNumber);
    $.ajax({
             type: "GET",
             url: "/single/" + idNumber,
             dataType: "json",
             success: displaySingle
        }).fail(function(){
            console.log("It Blew Up")
        });
    };
function displaySingle(data){
    $("#work-area").empty();
    var $header = $("<h1> Permit No. " + data[0]._id + "</h1>");
    $("#work-area").append($header);
    $header.append("</br>");
    $header.append(data[0].Project.Job_Address);
    $header.append(data[0].Project.City);
    $header.append(data[0].Project.State);
    $header.append(data[0].Project.Job_Description);
    console.log(data[0].Project.State);
}    


