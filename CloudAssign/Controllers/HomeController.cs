using CloudAssign.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.UI;
using System.Web.UI.WebControls;
using Facebook;
using System.Net;
using System.IO;

namespace CloudAssign.Controllers 
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View(new CloudAssignDBLinqDataContext().Places.ToList());
        }

        //Facebook Authorization method
        public void CheckAuthorization()
        {

            string app_id = "202811020075962";
            string app_secret = "976c2e3ba7b6cc73392afefe656808f0";
            string scope = "public_profile";

            if (Request["code"] == null)
            {
                Response.Redirect(string.Format(
                    "https://graph.facebook.com/oauth/authorize?client_id={0}&redirect_uri={1}&scope={2}",
                    app_id, Request.Url.AbsoluteUri, scope));
            }
            else
            {
                Dictionary<string, string> tokens = new Dictionary<string, string>();

                string url = string.Format("https://graph.facebook.com/oauth/access_token?client_id={0}&redirect_uri={1}&code={2}&client_secret={3}&scope={4}",
                    app_id, Request.Url.AbsoluteUri, Request["code"].ToString(), app_secret,scope);
                HttpWebRequest request = WebRequest.Create(url) as HttpWebRequest;

                using (HttpWebResponse response = request.GetResponse() as HttpWebResponse)
                {
                    StreamReader reader = new StreamReader(response.GetResponseStream());

                    string vals = reader.ReadToEnd();

                    foreach (string token in vals.Split('&'))
                    {
                        tokens.Add(token.Substring(0, token.IndexOf("=")),
                            token.Substring(token.IndexOf("=") + 1, token.Length - token.IndexOf("=") - 1));
                    }
                }


                string access_token = tokens["access_token"];


                var client = new FacebookClient(access_token);
                dynamic result = client.Get("me");
                Response.Cookies.Add(new HttpCookie("user", result.name));
                Response.Redirect("/");
            }
        }

        //add a city
        public void add(string city)
        {
            var db = new CloudAssignDBLinqDataContext();
            if (db.Places.FirstOrDefault(x => x.CityCountry == city) == null)
            {
                db.Places.InsertOnSubmit(new Place() { CityCountry = city });
                db.SubmitChanges();
            }
        }
        //remove a city
        public void remove(string city) {
            var db = new CloudAssignDBLinqDataContext();
            db.Places.DeleteOnSubmit(db.Places.FirstOrDefault(x=>x.CityCountry==city));
            db.SubmitChanges();
        }
    }
}