$(function () {

    // Calculations
    var xSpace = 0,
        ySpace = 200,
        zSpace = 200,
        translateX = 0,
        translateY = ySpace * -1,
        translateZ = zSpace * -1;

    // Model
    var Contact = Backbone.Model.extend({
        defaults: function () {
            return {
                name: 'Unknown',
                phone: 'Unknown',
                image: 'img/unknown.png',
                url: '',
                zIndex : '1'
            };
        },
        initialize: function () {
            // Setup defaults
            this.options = _.extend(this.defaults, this.options);

            // Setup default location data
            this.set({ 'x': translateX, 'y': translateY, 'z': translateZ });
            translateX -= xSpace;
            translateY -= ySpace;
            translateZ -= zSpace;
        }
    });

    // Collection
    var ContactList = Backbone.Collection.extend({
        model: Contact
    });
    var Contacts = new ContactList;

    // View
    var ContactView = Backbone.View.extend({
        tagName: "li",
        className: "contact-item",
        template: _.template($("#contact-template").html()),
        events: {
            "dblclick": "edit"
        },
        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
        },
        edit: function () {
            alert("Edit " + this.model.get("name"));
        },
        render: function () {
            // Setup view from template
            this.$el.html(this.template(this.model.toJSON()));

            // Get transform values
            var x = this.model.get('x');
            var y = this.model.get('y');
            var z = this.model.get('z');

            // Update transform
            this.$el.css('-webkit-transform', 'translate3d(' + x + 'px, ' + y + 'px, ' + z + 'px)');
            this.$el.css('z-index', this.model.get('zIndex'));

            // Check if we should fade out
            if (y >= ySpace) {
                this.$el.css('opacity', 0);
            }
            else {
                this.$el.css('opacity', 1);
            }

            return this;
        },
        clear: function () {
            this.model.destroy();
        }
    });

    // Main View
    var AppView = Backbone.View.extend({
        el: $("#content-view"),
        events: {
        },
        initialize: function () {

            // Listeners
            this.listenTo(Contacts, 'add', this.addContact);
            this.listenTo(Contacts, 'reset', this.addAllContacts);

            // Create some contants (you could load them from wherever!)
            var c1 = new Contact({ zIndex:4, name: "Jeff Hodnett", image: "img/jeff.png", phone: "+1 2345678", url: "https://twitter.com/jeffhodnett" });
            var c2 = new Contact({ zIndex:3, name: "Gentian Edwards", image: "img/gentian.png", url: "https://twitter.com/GentianEdwards" });
            var c3 = new Contact({ zIndex:2, name: "Chris Knight", image: "img/chris.jpeg", url: "https://twitter.com/chrisknight2", phone: "+1 87654321" });
            var c4 = new Contact({ zIndex:1, name: "Leon", image: "img/leon.jpg", url: "https://twitter.com/flypostboy" });
            Contacts.add(c1);
            Contacts.add(c2);
            Contacts.add(c3);
            Contacts.add(c4);
            
            // Add all the contacts
            this.addAllContacts();

            // Setup mouse wheel scroll
            var self = this;
            $(document).mousewheel(function (event, delta, deltaX, deltaY) {
                // Check if we are scrolling in the y
                if (deltaY >= 0) {
                    Contacts.each(function (item) {
                        self.animateItem(item, xSpace, ySpace, zSpace);
                    });
                }
                else {
                    Contacts.each(function (item) {
                        self.animateItem(item, -xSpace, -ySpace, -zSpace);
                    });
                }
            });

        },
        addContact: function (contact) {
            var view = new ContactView({ model: contact });
            this.$("#contacts-stack").append(view.render().el);
        },
        addAllContacts: function () {
            Contacts.each(this.addContact, this);
        },
        animateItem: function (item, x, y, z) {
            // Perform calculation
            var updatedX = item.get('x') + x;
            var updatedY = item.get('y') + y;
            var updatedZ = item.get('z') + z;

            // Update value
            item.set({ x: updatedX, y: updatedY, z: updatedZ });
        }

    });

    // Bang - lets go!
    var App = new AppView;
});