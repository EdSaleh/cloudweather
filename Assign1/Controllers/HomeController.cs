using Assign1.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Assign1.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View(new CloudAssignDBLinqDataContext().Places.ToList());
        }
        public void add(string city)
        {
            var db = new CloudAssignDBLinqDataContext();
            if (db.Places.FirstOrDefault(x => x.CityCountry == city) == null)
            {
                db.Places.InsertOnSubmit(new Place() { CityCountry = city });
                db.SubmitChanges();
            }
        }
        public void remove(string city) {
            var db = new CloudAssignDBLinqDataContext();
            db.Places.DeleteOnSubmit(db.Places.FirstOrDefault(x=>x.CityCountry==city));
            db.SubmitChanges();
        }

    }
}